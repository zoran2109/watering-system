import cron from 'node-cron'
import { Device, DeviceLog } from '../models/index.js'
import { SERVER_URL, ROUTE_URLS } from '../helpers/constants.js'
import { log, logInfo, logError } from '../helpers/logger.js'
import dayjs from 'dayjs'

cron.schedule('*/30 * * * *', async () => {
    logInfo('Running pump scheduler job...')

    try {
        const pumps = await Device.findAll({
            where: {
                type: 'pump',
                settings: {
                    manualMode: false,
                },
            },
        })

        const now = dayjs()
        const today = now.format('YYYY-MM-DD')

        for (const pump of pumps) {
            logInfo('Pump found', deviceId)
            const { deviceId, settings } = pump
            const { wateringHour, wateringDuration } = settings

            logInfo('Watering hour defined:', wateringHour === undefined)
            if (wateringHour === undefined) continue

            const isHourPassed = now.hour() >= wateringHour
            logInfo('Is hour passed', isHourPassed, now.hour(), wateringHour)
            if (!isHourPassed) continue

            const lastLog = await DeviceLog.findOne({
                where: { deviceId },
                order: [['timestamp', 'DESC']],
            })

            const alreadyWateredToday =
                lastLog &&
                dayjs(lastLog.timestamp).format('YYYY-MM-DD') === today

            logInfo(
                'Already watered today:',
                alreadyWateredToday,
                lastLog,
                dayjs(lastLog.timestamp).format('YYYY-MM-DD'),
                today
            )
            if (!alreadyWateredToday) {
                logInfo(`Sending watering command to ${deviceId}`)

                await fetch(`${SERVER_URL}${ROUTE_URLS.START_WATERING}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: 'WATER',
                        duration: wateringDuration,
                    }),
                })
            } else {
                logInfo(`Already watered today: ${deviceId}`)
            }
        }
    } catch (err) {
        logError('Error in pump scheduler:', err)
    }
})
