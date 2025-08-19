import { WateringStrategy } from './WateringStrategy.js'
import { logInfo, logError } from '../../helpers/logger.js'
import { jobMonitor } from '../../jobs/JobMonitor.js'

export class WifiWateringStrategy extends WateringStrategy {
    constructor(pumpHost) {
        super()
        this.pumpHost = pumpHost
    }

    async send(command) {
        const { command: cmd, duration, deviceId } = command
        if (cmd !== 'WATER') {
            throw new Error(`Invalid command: ${cmd}`)
        }

        try {
            logInfo(
                `Sending WiFi watering command to ${this.pumpHost} for ${duration} ms`
            )

            const res = await fetch(
                `http://${this.pumpHost}/water?duration=${duration}`,
                {
                    method: 'POST',
                }
            )

            if (!res.ok) {
                throw new Error(`Pump API error: ${res.status}`)
            }

            jobMonitor.jobStarted(deviceId)

            // Wait until pump signals done, assume endpoint returns when done
            const resultText = await res.text()
            logInfo('Pump response:', resultText)

            jobMonitor.jobEnded(deviceId, true)
            return resultText
        } catch (err) {
            jobMonitor.jobEnded(deviceId, false)
            logError(err)
            throw err
        }
    }
}
