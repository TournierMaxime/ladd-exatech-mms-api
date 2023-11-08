const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('FAQSection', {
      sectionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      faqId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'FAQ',
          key: 'faqId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: DataTypes.ENUM('text', 'image', 'video'),
        defaultValue: 'text',
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
    return queryInterface.addIndex('FAQSection', ['type'])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('FAQSection')
  }
}
