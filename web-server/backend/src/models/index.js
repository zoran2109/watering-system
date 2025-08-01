import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import DeviceModel from './device.js';
import DeviceLogModel from './deviceLog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/database.sqlite'),
  logging: false,
});

const Device = DeviceModel(sequelize);
const DeviceLog = DeviceLogModel(sequelize);

Device.hasMany(DeviceLog, { foreignKey: 'deviceId' });
DeviceLog.belongsTo(Device, { foreignKey: 'deviceId' });

export { sequelize, Device, DeviceLog };
