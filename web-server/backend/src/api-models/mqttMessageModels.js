import { z } from 'zod'

export const MqttMessage = z.object({
    deviceId: z.string().min(1),
    msg: z.string().min(1),
    value: z.union([z.number(), z.string(), z.null()]).optional(),
    type: z.string().min(1),
    success: z.boolean(),
})
