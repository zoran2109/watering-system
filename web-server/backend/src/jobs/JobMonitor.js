import { mqttBus } from '../mqtt/mqttClient.js'
import { DeviceLog } from '../db/models/index.js'
import { logInfo, logError } from '../helpers/logger.js'
import { MqttPumpStatusMessage } from '../api-models/mqttMessageModels.js'
import { MAX_JOB_DURATION_MS } from '../helpers/constants.js'

/**
 * Class that monitors status of (watering) jobs:
 * - prevents starting another job on the same host where the job is currently running
 * - saves log after job ends
 * - TODO: sends SSE with updates
 *
 * How it works:
 * - for MQTT jobs, it listens for new events and updates the state
 * - for Serial and Wifi strategy call jobStarted and jobEnded methods to update the state
 */
class JobMonitor {
    constructor() {
        this.jobs = new Map() // deviceId -> { inProgress, startedAt, timeout }

        mqttBus.on('pump/status', (raw) => {
            try {
                const msg = JSON.parse(raw)
                const parsed = MqttPumpStatusMessage.parse(msg)
                this.handlePumpStatus(parsed)
            } catch (err) {
                logError('Invalid pump/status message', raw, err)
            }
        })
    }

    jobStarted(deviceId) {
        if (this.isBusy(deviceId)) {
            throw new Error(`Pump ${deviceId} already watering`)
        }

        const startedAt = new Date()
        logInfo(`Job started for ${deviceId}`)

        // End automatically after MAX_JOB_DURATION_MS
        const timeout = setTimeout(() => {
            logError(`⏱Job for ${deviceId} exceeded max duration, auto-ending`)
            this.jobEnded(
                deviceId,
                false,
                null,
                'Timeout - no completion message'
            )
        }, MAX_JOB_DURATION_MS)

        this.jobs.set(deviceId, { inProgress: true, startedAt, timeout })
    }

    async jobEnded(deviceId, success, value = null, message = null) {
        const existing = this.jobs.get(deviceId) || {}

        // Cancel if timeout is still running
        if (existing.timeout) {
            clearTimeout(existing.timeout)
        }

        const job = {
            ...existing,
            inProgress: false,
            endedAt: new Date(),
            lastMessage: message ?? 'Ended',
        }

        this.jobs.set(deviceId, job)

        try {
            await DeviceLog.create({
                deviceId,
                logData: {
                    type: 'pump',
                    success,
                    value,
                    message,
                    endedAt: new Date(),
                },
            })
            logInfo(`Watering ended - log saved for ${deviceId}`)
        } catch (err) {
            logError('Error saving the watering log', err)
        }
    }

    isBusy(deviceId) {
        const job = this.jobs.get(deviceId)
        if (!job) return false

        if (job.inProgress) {
            const elapsed = Date.now() - job.startedAt.getTime()
            if (elapsed > MAX_JOB_DURATION_MS) {
                logError(
                    `Job for ${deviceId} exceeded max timeout duration, auto-ending`
                )
                this.jobEnded(
                    deviceId,
                    false,
                    null,
                    'Timeout - auto-closed on isBusy check'
                )
                return false
            }
        }

        return job.inProgress
    }

    handlePumpStatus(msg) {
        if (msg.message.includes('started')) {
            this.jobStarted(msg.deviceId)
        } else {
            this.jobEnded(msg.deviceId, msg.success, msg.value, msg.message)
        }
    }
}

export const jobMonitor = new JobMonitor()
