const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Errors', {
      errorId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      errorCode: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      errorLevel: {
        type: DataTypes.ENUM('warning', 'error', 'critical'),
        allowNull: true
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Errors')
  }
}
