import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'

const Errors = sequelize.define(
  'Errors',
  {
    errorId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    errorCode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    errorLevel: {
      type: DataTypes.ENUM('warning', 'error', 'critical'),
      allowNull: true
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'Errors',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      {
        fields: ['errorCode', 'errorLevel']
      }
    ]
  }
)

export default Errors
