import { DataTypes } from 'sequelize'

export default (sequelize) =>
    sequelize.define(
        'Device',
        {
            deviceId: { type: DataTypes.STRING, primaryKey: true },
            name: DataTypes.STRING,
            type: DataTypes.STRING,
            settings: DataTypes.JSON,
        },
        { tableName: 'devices', underscored: true }
    )
