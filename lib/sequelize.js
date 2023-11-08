import { Sequelize } from 'sequelize'
import { logger } from './logger.js'

const subProcess = 'sequelize'

// Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
    timezone: 'Europe/Paris'
  }
)

// Database connection
async function connectToDatabase () {
  await sequelize.authenticate()
}

// Database sync
async function syncDatabase () {
  await sequelize.sync({ alter: { drop: false } })
}

async function initDatabase () {
  try {
    await connectToDatabase()
    await syncDatabase()
  } catch (err) {
    logger.error({
      subProcess,
      msg: 'Unable to init the connection to database',
      errMsg: err.errMsg
    })
  }
}

async function releaseDatabase () {
  await sequelize.close()
}

export { sequelize, initDatabase, releaseDatabase }
