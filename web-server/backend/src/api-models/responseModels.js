import { z } from 'zod'
import { PUMP_COMMUNICATION_TYPES, DEVICE_TYPES } from '../helpers/constants'

export const DeviceBase = z.object({
    deviceId: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(Object.values(DEVICE_TYPES)),
})

// --- Pump Settings ---
const PumpSettings = z
    .object({
        manualMode: z.boolean(),
        wateringDuration: z.number().int().positive(),
        wateringHour: z.number().min(0).max(23), // 0–23 hour of day
        communicationType: z.enum(Object.values(PUMP_COMMUNICATION_TYPES)),
        connectionAddress: z.string().nullable(), // can be null if not set
    })
    .refine(
        (data) => {
            if (data.communicationType === 'mqtt') return true // null is fine
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

// --- Pump Device ---
const PumpDevice = DeviceBase.extend({
    type: z.literal('pump'),
    settings: PumpSettings,
})

// --- Sensor Device ---
const SensorDevice = DeviceBase.extend({
    type: z.literal('sensor'),
    settings: z.object({}).passthrough(), // allow empty object for now
})

// --- Union (Discriminator by `type`) ---
export const DeviceSchema = z.discriminatedUnion('type', [
    PumpDevice,
    SensorDevice,
])

// For arrays
export const DeviceArraySchema = z.array(DeviceSchema)
