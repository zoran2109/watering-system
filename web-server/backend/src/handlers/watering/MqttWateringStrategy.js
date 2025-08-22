import { sendMessage } from '../../mqtt/mqttClient.js'
import { WateringStrategy } from './WateringStrategy.js'
import { logInfo } from '../../helpers/logger.js'

/**
 * Strategy for starting the watering over MQTT.
 */
export class MqttWateringStrategy extends WateringStrategy {
    constructor() {
        super()
    }

    /**
     * Publishes the watering command to MQTT broker.
     * @param {object} command - Contains command for the pump, watering duration and deviceId
     */
    async send(command) {
        const { command: cmd, duration } = command
        if (cmd !== 'WATER') {
            throw new Error(`Invalid command: ${cmd}`)
        }

        logInfo(`Publishing watering command for ${duration} ms`)
        sendMessage('pump/water', JSON.stringify(command))
    }
}
