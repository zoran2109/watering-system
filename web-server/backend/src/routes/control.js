import express from 'express'
import { sendToArduino } from '../helpers/arduino.js'
import { SERVER_URL, ROUTE_URLS } from '../helpers/constants.js'

const router = express.Router()

/**
 * @swagger
 * /api/control/start-watering:
 *   post:
 *     summary: Starts watering on a pump
 *     tags: [Control]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               command:
 *                 type: string
 *               duration:
 *                 type: number
 */
router.post('/start-watering', async (req, res) => {
    try {
        let command
        if (typeof req.body === 'string') {
            command = req.body
        } else {
            const { command: cmd, duration } = req.body
            if (!cmd || !duration) {
                return res.status(400).json({ error: 'Missing fields' })
            }
            command = `${cmd} ${duration}`
        }

        await sendToArduino(command).then(
            await fetch(`${SERVER_URL}${ROUTE_URLS.LOGS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deviceId: 'arduino-uno-pump', // TODO: remove hard-coded value
                    logData: { ...req.body },
                }),
            }).then(console.log('Watering log saved'))
        )

        res.json({ status: 'sent', command })
    } catch (err) {
        console.error('🚨 Error sending command:', err.message)
        res.status(500).json({ error: err.message })
    }
})

export default router
