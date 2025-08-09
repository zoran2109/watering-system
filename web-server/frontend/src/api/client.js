import { wateringPumpApi, deviceApi, deviceLogsApi } from '../helpers/constants'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const startWatering = async (duration) => {
    const response = await fetch(wateringPumpApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            command: 'WATER',
            duration,
        }),
    })

    if (response.ok) {
        toast.success('💧 Watering started')
    } else {
        toast.error('⚠️ Failed to start watering')
    }
}

export const fetchDevices = async () =>
    await fetch(deviceApi).then((resp) => resp.json())

export const updateDevice = async (deviceId, payload) =>
    await fetch(`${deviceApi}/${deviceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

export const fetchDeviceLogs = async (deviceId) => {
    const response = await fetch(
        deviceId ? `${deviceLogsApi}?deviceId=${deviceId}` : deviceLogsApi
    )
    return response.json()
}
