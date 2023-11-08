const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('APK', {
      apkId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      versionCode: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      versionName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      apkUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
    return queryInterface.addIndex('APK', ['versionCode', 'versionName', 'apkUrl'], {
      name: 'idx_apk'
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('APK')
  }
}
