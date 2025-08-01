import express from 'express';
import { sendToArduino } from '../helpers/arduino.js'

const router = express.Router();

router.post('/start-watering', async (req, res) => {
  try {
    let command;
    if (typeof req.body === 'string') {
      command = req.body;
    } else {
      const { command: cmd, plantGroup, duration } = req.body;
      if (!cmd || !plantGroup || !duration) {
        return res.status(400).json({ error: 'Missing fields' });
      }
      command = `${cmd} ${plantGroup} ${duration}`;
    }

    await sendToArduino(command);
    res.json({ status: 'sent', command });
  } catch (err) {
    console.error('🚨 Error sending command:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
