import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'

const APK = sequelize.define(
  'APK',
  {
    apkId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    versionCode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    versionName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apkUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: 'APK',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      {
        fields: ['versionCode', 'versionName', 'apkUrl']
      }
    ]
  }
)

export default APK
