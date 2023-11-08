import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import Tickets from './Tickets.js'
import FAQ from './FAQ.js'
import FAQSection from './FAQSection.js'
import Interventions from './Interventions.js'
import Comments from './Comments.js'

const Images = sequelize.define(
  'Images',
  {
    imageId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ticketId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    commentId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    faqId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    sectionId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    interventionId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'Images',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false
  }
)

Tickets.hasMany(Images, {
  foreignKey: 'ticketId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
Images.belongsTo(Tickets, {
  foreignKey: 'ticketId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
Comments.hasMany(Images, {
  foreignKey: 'commentId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
Images.belongsTo(Comments, {
  foreignKey: 'commentId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
FAQ.hasMany(Images, {
  foreignKey: 'faqId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
Images.belongsTo(FAQ, {
  foreignKey: 'faqId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
FAQSection.hasMany(Images, {
  foreignKey: 'sectionId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
Images.belongsTo(FAQSection, {
  foreignKey: 'sectionId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

Interventions.hasMany(Images, {
  foreignKey: 'interventionId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})
Images.belongsTo(Interventions, {
  foreignKey: 'interventionId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default Images
