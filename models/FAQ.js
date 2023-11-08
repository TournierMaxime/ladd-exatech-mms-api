import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/sequelize.js'
import Machines from './Machines.js'
import FAQCategory from './FAQCategory.js'

const FAQ = sequelize.define(
  'FAQ',
  {
    faqId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    machineId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    faqCategoryId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  },
  {
    timestamps: true,
    tableName: 'FAQ',
    freezeTableName: true,
    createdAt: 'createdAt',
    updatedAt: false,
    indexes: [
      {
        fields: ['question']
      }
    ]
  }
)

Machines.hasMany(FAQ, {
  foreignKey: 'machineId',
  onUpdate: 'CASCADE'
})

FAQ.belongsTo(Machines, {
  foreignKey: 'machineId',
  onUpdate: 'CASCADE'
})

FAQCategory.hasMany(FAQ, {
  foreignKey: 'faqCategoryId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

FAQ.belongsTo(FAQCategory, {
  foreignKey: 'faqCategoryId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
})

export default FAQ
