import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import Errors from './Errors.js'
import Machines from './Machines.js'

const MachinesStatesHistory = sequelize.define(
  'MachinesStatesHistory',
  {
    machineStateHistoryId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    machineId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    errorId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    state: {
      type: DataTypes.ENUM('unknown', 'ok', 'ko'),
      allowNull: true
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'MachinesStatesHistory',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      {
        fields: ['state']
      }
    ]
  }
)

MachinesStatesHistory.belongsTo(Errors, {
  foreignKey: 'errorId',
  onUpdate: 'CASCADE'
})

Errors.hasMany(MachinesStatesHistory, {
  foreignKey: 'errorId',
  onUpdate: 'CASCADE'
})

MachinesStatesHistory.belongsTo(Machines, {
  foreignKey: 'machineId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Machines.hasMany(MachinesStatesHistory, {
  foreignKey: 'machineId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default MachinesStatesHistory
