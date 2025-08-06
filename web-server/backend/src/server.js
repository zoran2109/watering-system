import express from 'express'
import dotenv from 'dotenv'
import { PORT, ROUTE_URLS } from './helpers/constants.js'
import { sequelize } from './models/index.js'
import { seedDevices } from './db/seedDevices.js'
import devicesRouter from './routes/devices.js'
import logsRouter from './routes/logs.js'
import controlRouter from './routes/control.js'
import cors from 'cors'
import { setupSwagger } from './swagger.js'
import './jobs/pumpScheduler.js' // Starts the CRON

dotenv.config()

const app = express()

// Allow requests from Vite dev server (localhost:5173)
app.use(
    cors({
        origin: 'http://localhost:5173', // or '*', but that's less secure
        credentials: true,
    })
)

app.use(express.json())
setupSwagger(app)

app.use(ROUTE_URLS.DEVICES, devicesRouter)
app.use(ROUTE_URLS.LOGS, logsRouter)
app.use('/', controlRouter)

sequelize.sync().then(async () => {
    try {
        await seedDevices()
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`)
        })
    } catch (err) {
        console.error('❌ Error during seed or startup:', err)
    }
})
