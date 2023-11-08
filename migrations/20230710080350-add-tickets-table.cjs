const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Tickets', {
      ticketId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      status: {
        type: DataTypes.ENUM('open', 'closed', 'in-progress'),
        defaultValue: 'open',
        allowNull: false
      },
      errorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Errors',
          key: 'errorId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      machineId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Machines',
          key: 'machineId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      provider: {
        type: DataTypes.ENUM('MMS', 'Discord'),
        allowNull: false,
        defaultValue: 'MMS'
      },
      discordInviteLink: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
    return queryInterface.addIndex('Tickets', ['status', 'title', 'provider'])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Tickets')
  }
}
