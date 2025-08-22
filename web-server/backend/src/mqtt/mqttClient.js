import mqtt from 'mqtt'
import { EventEmitter } from 'events'
import { logInfo } from '../helpers/logger.js'

/**
 * Used in the rest of the code to wait events from specific topic with callback function
 */
export const mqttBus = new EventEmitter()

// eslint-disable-next-line no-undef
const client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost', {
    clientId: 'backend',
    clean: true,
})

client.on('connect', () => {
    logInfo('MQTT connected')
    client.subscribe('#')
})

client.on('message', (topic, message) => {
    const msg = message.toString()
    logInfo(`MQTT [${topic}]: ${msg}`)
    mqttBus.emit(topic, msg)
})

export function sendMessage(topic, msg) {
    client.publish(topic, msg)
}
