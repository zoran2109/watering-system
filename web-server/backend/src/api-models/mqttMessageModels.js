import { z } from 'zod'

export const MqttMessageBase = z.object({
    deviceId: z.string().min(1),
    message: z.string().min(1),
    value: z.union([z.number(), z.string(), z.null()]).optional(),
    type: z.string().min(1),
    success: z.boolean(),
})

export const MqttPumpStatusMessage = MqttMessageBase.extend({
    type: z.literal('pump'),
})
