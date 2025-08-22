import {
    wateringPumpApiUrl,
    deviceApiUrl,
    deviceLogsApiUrl,
} from '../helpers/constants'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const startWatering = async (deviceId, duration) => {
    const response = await fetch(wateringPumpApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            command: 'WATER',
            duration,
            deviceId,
        }),
    })

    if (response.ok) {
        toast.success('💧 Watering started')
    } else {
        toast.error('⚠️ Failed to start watering')
    }
}

export const fetchDevices = async () =>
    await fetch(deviceApiUrl).then((resp) => resp.json())

export const updateDevice = async (deviceId, payload) =>
    await fetch(`${deviceApiUrl}/${deviceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

export const fetchDeviceLogs = async (deviceId) => {
    const response = await fetch(
        deviceId ? `${deviceLogsApiUrl}?deviceId=${deviceId}` : deviceLogsApiUrl
    )
    return response.json()
}
