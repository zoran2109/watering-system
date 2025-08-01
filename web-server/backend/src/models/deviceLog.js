import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'DeviceLog',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      deviceId: { type: DataTypes.STRING, allowNull: false },
      logData: DataTypes.JSON,
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { tableName: 'device_logs', underscored: true }
  );
