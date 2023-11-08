import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import Errors from './Errors.js'

const Machines = sequelize.define(
  'Machines',
  {
    machineId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.ENUM('unknown', 'ok', 'ko'),
      defaultValue: 'unknown'
    },
    errorId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'Machines',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      {
        fields: ['code', 'type', 'state']
      }
    ]
  }
)

Machines.belongsTo(Errors, {
  foreignKey: 'errorId',
  onUpdate: 'CASCADE'
})

Errors.hasMany(Machines, {
  foreignKey: 'errorId',
  onUpdate: 'CASCADE'
})

export default Machines
