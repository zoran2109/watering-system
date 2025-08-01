import express from 'express';
import { DeviceLog } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { deviceId } = req.query;
  const where = deviceId ? { deviceId } : {};
  const logs = await DeviceLog.findAll({ where });
  res.json(logs);
});

router.post('/', async (req, res) => {
  const { deviceId, logData } = req.body;
  if (!deviceId || !logData) {
    return res.status(400).json({ error: 'deviceId and logData required' });
  }

  try {
    const log = await DeviceLog.create({ deviceId, logData });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
