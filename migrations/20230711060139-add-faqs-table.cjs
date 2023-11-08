const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('FAQ', {
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
        allowNull: true,
        references: {
          model: 'Machines',
          key: 'machineId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      faqCategoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'FAQCategory',
          key: 'faqCategoryId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
    return queryInterface.addIndex('FAQ', ['question'])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('FAQ')
  }
}
