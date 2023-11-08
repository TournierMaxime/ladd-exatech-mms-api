const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('MachinesStatesHistory', {
      machineStateHistoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
      errorId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Errors',
          key: 'errorId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      state: {
        type: DataTypes.ENUM('unknown', 'ok', 'ko'),
        allowNull: true
      },
      data: {
        type: DataTypes.JSON,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
    return queryInterface.addIndex('MachinesStatesHistory', ['state'])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('MachinesStatesHistory')
  }
}
