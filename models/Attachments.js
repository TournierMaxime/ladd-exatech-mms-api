import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import Comments from './Comments.js'
import Interventions from './Interventions.js'

const Attachments = sequelize.define(
  'Attachments',
  {
    attachmentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    commentId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false
    },
    interventionId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'Attachments',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      {
        fields: ['attachmentId', 'commentId', 'interventionId']
      }
    ]
  }
)

Attachments.belongsTo(Comments, {
  foreignKey: 'commentId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Comments.hasMany(Attachments, {
  foreignKey: 'commentId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Interventions.hasMany(Attachments, {
  foreignKey: 'interventionId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
Attachments.belongsTo(Interventions, {
  foreignKey: 'interventionId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default Attachments
