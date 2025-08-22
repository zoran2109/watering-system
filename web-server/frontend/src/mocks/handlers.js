import { http, HttpResponse } from 'msw'
import {
    wateringPumpApiUrl,
    deviceApiUrl,
    deviceLogsApiUrl,
} from '../helpers/constants'
import devicesJson from './mock-data/devices.json'
import logsJson from './mock-data/logs.json'

export const handlers = [
    http.get(deviceApiUrl, () => HttpResponse.json(devicesJson)),

    http.put(`${deviceApiUrl}/:deviceId`, async ({ params, request }) => {
        const { deviceId } = params
        const body = await request.json()

        console.log('Received PUT update for device:', deviceId, body)

        return HttpResponse.json({
            message: 'Device updated successfully',
            deviceId,
            updatedData: body,
        })
    }),

    http.get(deviceLogsApiUrl, ({ request }) => {
        const url = new URL(request.url)
        const deviceId = url.searchParams.get('deviceId')
        return HttpResponse.json(logsJson[deviceId])
    }),

    http.post(wateringPumpApiUrl, async ({ request }) => {
        const { command, duration } = await request.json()
        return HttpResponse.json({
            status: 'sent',
            command: `${command} ${duration}`,
        })
    }),
]
