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
