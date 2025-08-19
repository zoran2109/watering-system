import express from 'express'
import { Device, DeviceLog } from '../db/models/index.js'

const router = express.Router()

/**
 * @swagger
 * $ref: './docs/devices/devices.yml#/paths/~1devices/get'
 */
router.get('/', async (req, res) => {
    try {
        const devices = await Device.findAll({
            include: [
                {
                    model: DeviceLog,
                    as: 'latestLog',
                    separate: true,
                    limit: 1,
                    order: [['timestamp', 'DESC']],
                },
            ],
        })

        // Flatten logs to `lastLog` for cleaner frontend consumption
        const enrichedDevices = devices.map((device) => {
            const json = device.toJSON()
            return {
                ...json,
                lastLog: json.latestLog?.[0] || null,
                latestLog: undefined, // optional: remove array wrapper
            }
        })

        res.json(enrichedDevices)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/**
 * @swagger
 * $ref: './docs/devices/devices.yml#/paths/~1devices/post'
 */
router.post('/', async (req, res) => {
    try {
        const device = await Device.create(req.body)
        res.status(201).json(device)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

/**
 * @swagger
 * $ref: './docs/devices/devices.yml#/paths/~1devices/{deviceId}/put'
 */
router.put('/:deviceId', async (req, res) => {
    try {
        const [updated] = await Device.update(req.body, {
            where: { deviceId: req.params.deviceId },
        })
        if (updated) {
            const device = await Device.findByPk(req.params.deviceId)
            return res.json(device)
        }
        res.status(404).json({ error: 'Device not found' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

/**
 * @swagger
 * $ref: './docs/devices/devices.yml#/paths/~1devices/{deviceId}/delete'
 */
router.delete('/:deviceId', async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.deviceId)

        if (!device) {
            return res.status(404).json({ error: 'Device not found' })
        }

        await device.destroy()
        res.json(device)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

export default router
