import { z } from 'zod'
import { PUMP_COMMUNICATION_TYPES, DEVICE_TYPES } from '../helpers/constants'

export const DeviceBase = z.object({
    deviceId: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(Object.values(DEVICE_TYPES)),
})

const PumpSettings = z
    .object({
        manualMode: z.boolean(),
        wateringDuration: z.number().int().positive(),
        wateringHour: z.number().min(0).max(23),
        communicationType: z.enum(Object.values(PUMP_COMMUNICATION_TYPES)),
        connectionAddress: z.string().nullable(),
    })
    .refine(
        (data) => {
            // mqtt communivation type doesn't need connectionAdress set because it's set via .env
            if (data.communicationType === 'mqtt') return true
            return (
                data.connectionAddress !== null &&
                data.connectionAddress.trim() !== ''
            )
        },
        {
            message:
                'connectionAddress is required for serial/wifi communication',
            path: ['connectionAddress'],
        }
    )

const PumpDevice = DeviceBase.extend({
    type: z.literal('pump'),
    settings: PumpSettings,
})

const SensorDevice = DeviceBase.extend({
    type: z.literal('sensor'),
    settings: z.object({}).passthrough(), // allows empty object for now
})

export const DeviceSchema = z.discriminatedUnion('type', [
    PumpDevice,
    SensorDevice,
])

export const DeviceArraySchema = z.array(DeviceSchema)
