import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import Tickets from './Tickets.js'
import Machines from './Machines.js'

const Interventions = sequelize.define(
  'Interventions',
  {
    interventionId: {
      type: DataTypes.UUID(),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ticketId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    machineId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    mode: {
      type: DataTypes.ENUM('from distance', 'on spot'),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(),
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT(),
      allowNull: true
    },
    plannedInterventionDate: {
      type: DataTypes.DATE()
    },
    realInterventionDate: {
      type: DataTypes.DATE()
    },
    status: {
      type: DataTypes.ENUM('new', 'validate', 'ended'),
      defaultValue: 'new',
      allowNull: false
    },
    result: {
      type: DataTypes.ENUM('ok', 'ko')
    },
    resultComment: {
      type: DataTypes.TEXT(),
      allowNull: true
    },
    interventionTime: {
      type: DataTypes.INTEGER(),
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'Interventions',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false
  })

Tickets.hasOne(Interventions, {
  foreignKey: 'ticketId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
Interventions.belongsTo(Tickets, {
  foreignKey: 'ticketId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Machines.hasMany(Interventions, {
  foreignKey: 'machineId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
Interventions.belongsTo(Machines, {
  foreignKey: 'machineId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default Interventions
