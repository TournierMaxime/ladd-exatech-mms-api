const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Machines', {
      machineId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.ENUM('unknown', 'ok', 'ko'),
        defaultValue: 'unknown'
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
      data: {
        type: DataTypes.JSON,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
    return queryInterface.addIndex('Machines', ['type', 'code', 'state'])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Machines')
  }
}
