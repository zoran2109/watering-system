export const PORT = process.env.PORT || 3000

/**
 * Used inside the service, works inside docker compose
 */
export const SERVER_URL = `http://localhost:${PORT}`

export const ROUTE_URLS = {
    LOGS: '/logs',
    DEVICES: '/devices',
    START_WATERING: '/start-watering',
}

export const VITE_DEV_SERVER = 'http://localhost:5173'

export const PUMP_COMMUNICATION_TYPES = {
    MQTT: 'mqtt',
    SERIAL: 'serial',
    WIFI: 'wifi',
}

export const DEVICE_TYPES = {
    PUMP: 'pump',
    SENSOR: 'sensor',
}
