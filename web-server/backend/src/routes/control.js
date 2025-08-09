import express from 'express'
import { sendToArduino } from '../helpers/arduino.js'
import { SERVER_URL, ROUTE_URLS } from '../helpers/constants.js'
import { logInfo, logError } from '../helpers/logger.js'

const router = express.Router()

/**
 * @swagger
 * /start-watering:
 *   post:
 *     summary: Send a command to Arduino to start watering
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
 *     responses:
 *       200:
 *         description: Command sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 command:
 *                   type: string
 *       400:
 *         description: Missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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

        await sendToArduino(command)

        // Save log for watering
        try {
            await fetch(`${SERVER_URL}${ROUTE_URLS.LOGS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deviceId: 'arduino-uno-pump',
                    logData: { ...req.body },
                }),
            })
            logInfo('Watering log saved')
        } catch (err) {
            logError('Error saving watering log', err)
        }

        res.json({ status: 'sent', command })
    } catch (err) {
        logError('Error sending command:', err.message)
        res.status(500).json({ error: err.message })
    }
})

export default router
