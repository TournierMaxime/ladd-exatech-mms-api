const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
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
        allowNull: true,
        references: {
          model: 'Tickets',
          key: 'ticketId'
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
      faqId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'FAQ',
          key: 'faqId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sectionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'FAQSection',
          key: 'sectionId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Images')
  }
}
