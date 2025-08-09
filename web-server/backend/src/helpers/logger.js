const timestamp = () => new Date().toISOString()

export const log = (...args) => {
    console.log(`[${timestamp()}]`, ...args)
}

export const logError = (...args) => {
    console.error(`[${timestamp()}] ❌`, ...args)
}

export const logInfo = (...args) => {
    console.info(`[${timestamp()}] ℹ️ `, ...args)
}

export const logWarn = (...args) => {
    console.warn(`[${timestamp()}] ⚠️ `, ...args)
}

export function requestLogger(req, res, next) {
    const start = Date.now()
    res.on('finish', () =>
        log(`${req.method} ${req.originalUrl} ${res.statusCode}`)
    )
    next()
}

export function errorLogger(err, req, res, next) {
    logError(`${req.method} ${req.originalUrl} - ${err.message}`)
    next(err)
}
