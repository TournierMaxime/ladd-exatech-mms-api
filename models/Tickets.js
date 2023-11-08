import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import Errors from './Errors.js'
import Machines from './Machines.js'

const Tickets = sequelize.define(
  'Tickets',
  {
    ticketId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    status: {
      type: DataTypes.ENUM('open', 'closed', 'in-progress'),
      defaultValue: 'open',
      allowNull: false
    },
    errorId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    machineId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    provider: {
      type: DataTypes.ENUM('MMS', 'Discord'),
      allowNull: false,
      defaultValue: 'MMS'
    },
    discordInviteLink: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'Tickets',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      {
        fields: ['status', 'title', 'provider']
      }
    ]
  }
)

Tickets.belongsTo(Errors, {
  foreignKey: 'errorId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Errors.hasMany(Tickets, {
  foreignKey: 'errorId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Tickets.belongsTo(Machines, {
  foreignKey: 'machineId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Machines.hasMany(Tickets, {
  foreignKey: 'machineId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default Tickets
