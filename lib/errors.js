class LaddError {
  constructor (message, code) {
    this.code = code ?? 1
    this.message = message
  }
}

class NotImplementedError extends LaddError {
  constructor (message) {
    super(message, 2)
  }
}

class HttpError extends LaddError {
  httpStatusCode = null

  constructor (statusCode, message) {
    super(message, 10)
    this.httpStatusCode = statusCode
  }
}

class HttpBadRequestError extends HttpError {
  constructor (message) {
    super(400, message ?? 'Bad request')
  }
}

class HttpUnauthorizedError extends HttpError {
  constructor (message) {
    super(401, message ?? 'Unauthorized')
  }
}

class HttpForbiddenError extends HttpError {
  constructor (message) {
    super(403, message ?? 'Access denied')
  }
}

class HttpNotFoundError extends HttpError {
  constructor (message) {
    super(404, message ?? 'Not found')
  }
}

class HttpServerError extends HttpError {
  constructor (message) {
    super(500, message ?? 'Server error')
  }
}

export {
  LaddError,
  NotImplementedError,
  HttpError,
  HttpBadRequestError,
  HttpForbiddenError,
  HttpNotFoundError,
  HttpServerError,
  HttpUnauthorizedError
}
