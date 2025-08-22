import { MqttWateringStrategy } from './MqttWateringStrategy.js'
import { SerialWateringStrategy } from './SerialWateringStrategy.js'
import { WifiWateringStrategy } from './WifiWateringStrategy.js'
import { PUMP_COMMUNICATION_TYPES } from '../../helpers/constants.js'

let mqttStrategyInstance = null

/** Factory that returns appropriate instance of watering strategy class based on provided type.*/
export class StrategyFactory {
    static getStrategy(type, config = {}) {
        switch (type) {
            case PUMP_COMMUNICATION_TYPES.MQTT:
                if (!mqttStrategyInstance) {
                    mqttStrategyInstance = new MqttWateringStrategy()
                }
                return mqttStrategyInstance
            case PUMP_COMMUNICATION_TYPES.SERIAL:
                return new SerialWateringStrategy(config)
            case PUMP_COMMUNICATION_TYPES.WIFI:
                return new WifiWateringStrategy(config)
            default:
                throw new Error(`Unknown strategy: ${type}`)
        }
    }
}
