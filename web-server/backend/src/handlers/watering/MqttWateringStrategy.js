import { sendMessage } from '../../mqtt/mqttClient.js'
import { WateringStrategy } from './WateringStrategy.js'
import { logInfo } from '../../helpers/logger.js'

export class MqttWateringStrategy extends WateringStrategy {
    constructor() {
        super()
    }

    async send(command) {
        const { command: cmd, duration } = command
        if (cmd !== 'WATER') {
            throw new Error(`Invalid command: ${cmd}`)
        }

        logInfo(`Publishing watering command for ${duration} ms`)
        sendMessage('pump/water', JSON.stringify(command))
    }
}
