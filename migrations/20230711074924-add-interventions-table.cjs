const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Interventions', {
      interventionId: {
        type: DataTypes.UUID(),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
      ticketId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Tickets',
          key: 'ticketId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      mode: {
        type: DataTypes.ENUM('from distance', 'on spot'),
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(),
        allowNull: false
      },
      details: {
        type: DataTypes.TEXT(),
        allowNull: true
      },
      plannedInterventionDate: {
        type: DataTypes.DATE()
      },
      realInterventionDate: {
        type: DataTypes.DATE()
      },
      status: {
        type: DataTypes.ENUM('new', 'validate', 'ended'),
        defaultValue: 'new',
        allowNull: false
      },
      result: {
        type: DataTypes.ENUM('ok', 'ko')
      },
      resultComment: {
        type: DataTypes.TEXT(),
        allowNull: true
      },
      interventionTime: {
        type: DataTypes.INTEGER(),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
    return queryInterface.addIndex('Interventions', ['mode', 'type', 'plannedInterventionDate', 'realInterventionDate', 'status', 'result'], {
      name: 'idx_interventions'
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Interventions')
  }
}
