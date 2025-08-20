import express from 'express'
import { StrategyFactory } from '../handlers/watering/StrategyFactory.js'
import { Device } from '../db/models/index.js'
import { jobMonitor } from '../jobs/JobMonitor.js'

const router = express.Router()

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
