import { http, HttpResponse } from 'msw'
import { wateringPumpApi, deviceApi, deviceLogsApi } from '../helpers/constants'
import devicesJson from './mock-data/devices.json'
import logsJson from './mock-data/logs.json'

export const handlers = [
    http.get(deviceApi, () => HttpResponse.json(devicesJson)),

    http.put(`${deviceApi}/:deviceId`, () => {
        return HttpResponse.json('200 OK')
    }),

    http.get(deviceLogsApi, ({ request }) => {
        const url = new URL(request.url)
        const deviceId = url.searchParams.get('deviceId')
        return HttpResponse.json(logsJson[deviceId])
    }),

    http.post(wateringPumpApi, async ({ request }) => {
        const { command, duration } = await request.json()
        return HttpResponse.json({
            status: 'sent',
            command: `${command} ${duration}`,
        })
    }),
]
