import { z } from 'zod'

export const SseMessage = z.object({
    type: z.string().min(1),
    msg: z.string().min(1),
    severity: z.enum(['info', 'warn', 'error']),
})
