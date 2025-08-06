const timestamp = () => new Date().toISOString()

export const log = (...args) => {
    console.log(`[${timestamp()}]`, ...args)
}

export const logError = (...args) => {
    console.error(`[${timestamp()}] ❌`, ...args)
}

export const logInfo = (...args) => {
    console.info(`[${timestamp()}] ℹ️`, ...args)
}

export const logWarn = (...args) => {
    console.warn(`[${timestamp()}] ⚠️`, ...args)
}
