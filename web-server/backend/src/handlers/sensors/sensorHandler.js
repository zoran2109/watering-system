import { subscribe } from '../mqtt/mqttClient.js'
import { sendSSE } from '../sse/sseManager.js'
import { saveSensorLog } from '../db/sensorLogs.js'

// TODO: use sensor handler
// Refactor to use EventBus
export class SensorHandler {
    constructor(deviceId) {
        this.deviceId = deviceId
        subscribe(`sensors/${deviceId}`, this.handleMessage.bind(this))
    }

    async handleMessage(msg) {
        const parsed = JSON.parse(msg)
        await saveSensorLog(parsed)
        sendSSE({
            type: 'sensor',
            msg: `New reading from ${this.deviceId}`,
            severity: 'info',
        })
    }
}
