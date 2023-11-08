import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import {
  earlyPhaseMiddleWare,
  latePhaseMiddleware,
  latePhaseMiddlewareWithError
} from '../lib/expressCommon.js'
import ExpressRouter from '../routes/ExpressRouter.js'
import cookieParser from 'cookie-parser'
import { logger } from '../lib/logger.js'
import { fileURLToPath } from 'url'
import path from 'path'
import { Client, GatewayIntentBits } from 'discord.js'

const subProcess = 'httpServer'

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] })

discordClient.login(process.env.DISCORD_BOT_TOKEN)

discordClient.on('ready', () => {
  console.log(`Discord BOT logged in as ${discordClient.user.tag}!`)
})

const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)

const expressServer = express()
const httpServer = createServer(expressServer)

expressServer.use(
  '/var/data/tickets',
  express.static(path.join(__dirname, '..', 'var', 'data', 'tickets'))
)

expressServer.use(
  '/var/data/faq',
  express.static(path.join(__dirname, '..', 'var', 'data', 'faq'))
)

expressServer.use(
  '/var/data/apks',
  express.static(path.join(__dirname, '..', 'var', 'data', 'apks'))
)

expressServer.use(cookieParser())
expressServer.use(cors({ credentials: true, origin: '*' }))
expressServer.use(bodyParser.json({ limit: '100mb' }))

expressServer.use(earlyPhaseMiddleWare)

expressServer.get('/', function (req, res) {
  res.send({ msg: `Welcome to ${process.env.SERVICE_ID} API root !` })
})

expressServer.use('/', ExpressRouter)

expressServer.use(latePhaseMiddleware)
expressServer.use(latePhaseMiddlewareWithError)

httpServer.listen(process.env.EXPRESS_PORT, () => {
  logger.info({
    subProcess,
    msg: 'Http server is listening on port ' + process.env.EXPRESS_PORT
  })
})

export { expressServer, httpServer, discordClient }
