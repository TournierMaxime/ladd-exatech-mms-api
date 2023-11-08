import { HttpError, HttpNotFoundError, LaddError } from './errors.js'
import { logger } from './logger.js'

const subProcess = 'expressServer'

function earlyPhaseMiddleWare (req, res, next) {
  res.status(404)
  next()
}

function latePhaseMiddleware (req, res, next) {
  if (res.statusCode === 404) {
    throw new HttpNotFoundError('Not found')
  }

  const logMessage = {
    subProcess,
    http: {
      method: req.method,
      path: req.path,
      status: res.statusCode
    },
    errMsg: null,
    errStack: null
  }

  logger.info(logMessage)

  next()
}

function latePhaseMiddlewareWithError (err, req, res, next) {
  let logStackTrace = false
  let errCode = 0

  if (err instanceof HttpError) {
    res.status(err.httpStatusCode)

    if (err.httpStatusCode >= 500) {
      logStackTrace = true
    }
    errCode = err.code
  } else if (err instanceof LaddError) {
    res.status(500)
    logStackTrace = true
    errCode = err.code
  } else {
    res.status(500)
    logStackTrace = true
  }

  res.json({
    errClass: err.constructor.name,
    errMsg: err.message,
    errCode
  })

  const logMessage = {
    subProcess,
    http: {
      method: req.method,
      path: req.path,
      status: res.statusCode
    },
    errClass: err.constructor.name,
    errMsg: err.message,
    errCode: err.code ?? 0,
    errStack: undefined
  }

  if (logStackTrace) {
    logMessage.errStack = err.stack
  }

  logger.error(logMessage)
}

export {
  earlyPhaseMiddleWare,
  latePhaseMiddleware,
  latePhaseMiddlewareWithError
}
