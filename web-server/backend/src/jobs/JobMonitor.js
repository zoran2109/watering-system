import { mqttBus } from '../mqtt/mqttClient.js'
import { DeviceLog } from '../db/models/index.js'
import { logInfo, logError } from '../helpers/logger.js'
import { z } from 'zod'

const MAX_JOB_DURATION_MS = 3 * 60 * 1000 + 200 // 3 minutes safety cap

const PumpStatusSchema = z.object({
    deviceId: z.string(),
    type: z.literal('pump'),
    success: z.boolean(),
    message: z.string(),
    value: z.number().optional(),
})

class JobMonitor {
    constructor() {
        this.jobs = new Map() // deviceId -> { inProgress, startedAt, timeout }

        mqttBus.on('pump/status', (raw) => {
            try {
                const msg = JSON.parse(raw)
                const parsed = PumpStatusSchema.parse(msg)
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
        logInfo(`🌱 Job started for ${deviceId}`)

        // watchdog: end automatically after MAX_JOB_DURATION_MS
        const timeout = setTimeout(() => {
            logError(
                `⏱️ Job for ${deviceId} exceeded max duration, auto-ending`
            )
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

        // cancel watchdog if still running
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
            logInfo(`💾 Watering log saved for ${deviceId}`)
        } catch (err) {
            logError('Error saving watering log', err)
        }
    }

    isBusy(deviceId) {
        const job = this.jobs.get(deviceId)
        if (!job) return false

        if (job.inProgress) {
            const elapsed = Date.now() - job.startedAt.getTime()
            if (elapsed > MAX_JOB_DURATION_MS) {
                logError(
                    `⚠️ Job for ${deviceId} exceeded duration during isBusy check, auto-ending`
                )
                this.jobEnded(
                    deviceId,
                    false,
                    null,
                    'Timeout - auto closed on isBusy check'
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
