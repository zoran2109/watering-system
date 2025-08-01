import express from 'express';
import { Device } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const devices = await Device.findAll();
  res.json(devices);
});

router.post('/', async (req, res) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:deviceId', async (req, res) => {
  try {
    const [updated] = await Device.update(req.body, {
      where: { deviceId: req.params.deviceId },
    });
    if (updated) {
      const device = await Device.findByPk(req.params.deviceId);
      return res.json(device);
    }
    res.status(404).json({ error: 'Device not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:deviceId', async (req, res) => {
  try {
    const [updated] = await Device.delete(req.body, {
      where: { deviceId: req.params.deviceId },
    });
    if (deleted) {
      const device = await Device.findByPk(req.params.deviceId);
      return res.json(device);
    }
    res.status(404).json({ error: 'Device not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
