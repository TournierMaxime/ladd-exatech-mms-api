import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import Tickets from './Tickets.js'

const Comments = sequelize.define(
  'Comments',
  {
    commentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ticketId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: 'Comments',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      {
        fields: ['ticketId', 'userId']
      }
    ]
  }
)

Comments.belongsTo(Tickets, {
  foreignKey: 'ticketId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Tickets.hasMany(Comments, {
  foreignKey: 'ticketId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

/* Users.hasMany(Tickets, {
  foreignKey: 'userId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Tickets.hasMany(Users, {
  foreignKey: 'userId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
}) */

export default Comments
