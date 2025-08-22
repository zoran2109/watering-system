import express from 'express'
import dotenv from 'dotenv'
import {
    PORT,
    ROUTE_URLS,
    VITE_DEV_SERVER,
    SERVER_URL,
} from './helpers/constants.js'
import { sequelize } from './db/models/index.js'
import { seedDevices } from './db/seedDevices.js'
import devicesRouter from './routes/devices.js'
import logsRouter from './routes/logs.js'
import controlRouter from './routes/control.js'
import cors from 'cors'
import { setupSwagger } from './docs/swagger.js'
import {
    logInfo,
    logError,
    errorLogger,
    requestLogger,
} from './helpers/logger.js'

// Starts the CRON job for watering
import './jobs/pumpScheduler.js'

dotenv.config()

const app = express()

setupSwagger(app)

/** MIDDLEWARE */
app.use(
    cors({
        origin: VITE_DEV_SERVER,
        credentials: true,
    })
)
app.use(express.json())
app.use(requestLogger)

/** ROUTES */
app.use(ROUTE_URLS.DEVICES, devicesRouter)
app.use(ROUTE_URLS.LOGS, logsRouter)
app.use('/', controlRouter)

app.use(errorLogger)

app.get('/', (req, res) => {
    res.redirect('/docs')
})

sequelize.sync().then(async () => {
    try {
        await seedDevices()
        app.listen(PORT, () => {
            logInfo(`Server running on ${SERVER_URL}`)
        })
    } catch (err) {
        logError('Error during seed or startup:', err)
    }
})
