import mqtt from 'mqtt'
import { EventEmitter } from 'events'
import { logInfo, logError } from '../helpers/logger.js'

export const mqttBus = new EventEmitter()

const client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost', {
    clientId: 'backend',
    clean: true,
})

client.on('connect', () => {
    logInfo('MQTT connected')
    client.subscribe('#') // listen to all topics (or whitelist)
})

client.on('message', (topic, message) => {
    const msg = message.toString()
    logInfo(`MQTT [${topic}]: ${msg}`)
    mqttBus.emit(topic, msg)
})

export function sendMessage(topic, msg) {
    client.publish(topic, msg)
}
