import express from 'express'
import { SERVER_URL, ROUTE_URLS } from '../helpers/constants.js'
import { logInfo, logError, logWarn } from '../helpers/logger.js'
import { StrategyFactory } from '../handlers/watering/StrategyFactory.js'
import { Device } from '../db/models/index.js'
import { jobMonitor } from '../jobs/JobMonitor.js'

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
    const { deviceId } = req.body

    try {
        if (jobMonitor.isBusy(deviceId)) {
            return res.status(400).json({ error: 'Device already watering' })
        }

        const device = await Device.findOne({ where: { deviceId } })
        if (!device) return res.status(404).json({ error: 'Device not found' })

        /* jobMonitor.jobStarted(deviceId) */
        await StrategyFactory.getStrategy(
            device.settings.communicationType
        ).send(req.body)

        res.json({ status: 'sent', command: req.body })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default router
