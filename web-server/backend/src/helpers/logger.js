const timestamp = () => new Date().toISOString()

export const log = (...args) => {
    console.log(`[${timestamp()}]`, ...args)
}

export const logError = (...args) => {
    console.error(`[${timestamp()}] ERROR`, ...args)
}

export const logInfo = (...args) => {
    console.info(`[${timestamp()}] INFO `, ...args)
}

export const logWarn = (...args) => {
    console.warn(`[${timestamp()}] WARN `, ...args)
}

export function requestLogger(req, res, next) {
    const { method, originalUrl } = req

    res.on('finish', () => {
        const { statusCode } = res
        const logMethod =
            statusCode < 400 ? logInfo : statusCode < 500 ? logWarn : logError

        logMethod(`${method} ${originalUrl} ${statusCode}`)
    })

    next()
}

export function errorLogger(err, req, res, next) {
    logError(`${req.method} ${req.originalUrl} - ${err.message}`)
    next(err)
}
