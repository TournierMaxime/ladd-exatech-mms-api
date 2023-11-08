import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'

const FAQCategory = sequelize.define(
  'FAQCategory',
  {
    faqCategoryId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: true,
    tableName: 'FAQCategory',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      {
        fields: ['topic']
      }
    ]
  }
)

export default FAQCategory
