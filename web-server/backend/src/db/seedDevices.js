import { Device } from '../models/index.js';
import devicesJson from './devices.json' assert { type: 'json' };

export const seedDevices = async () => {
  for (const dev of devicesJson) {
    const exists = await Device.findByPk(dev.deviceId);
    if (!exists) await Device.create(dev);
  }
};
