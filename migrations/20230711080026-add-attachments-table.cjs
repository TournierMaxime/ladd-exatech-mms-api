const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Attachments', {
      attachmentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      interventionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Interventions',
          key: 'interventionId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      commentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Comments',
          key: 'commentId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      file: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Attachments')
  }
}
