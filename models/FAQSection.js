import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import FAQ from './FAQ.js'

const FAQSection = sequelize.define(
  'FAQSection',
  {
    sectionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    faqId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('text', 'image', 'video'),
      defaultValue: 'text',
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: 'FAQSection',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      {
        fields: ['type']
      }
    ]
  }
)

FAQ.hasMany(FAQSection, {
  foreignKey: 'faqId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

FAQSection.belongsTo(FAQ, {
  foreignKey: 'faqId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default FAQSection
