import cron from 'node-cron'
import { Device, DeviceLog } from '../models/index.js'
import { SERVER_URL, ROUTE_URLS } from '../helpers/constants.js'
import { logInfo, logError } from '../helpers/logger.js'
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

        if (pumps.length === 0) logInfo('No pumps set to automatic mode.')

        for (const pump of pumps) {
            const { deviceId, settings } = pump
            const { wateringHour, wateringDuration } = settings

            logInfo('Automated pump found:', deviceId)
            logInfo(
                `Watering hour for ${deviceId} defined:`,
                wateringHour === undefined ? 'No. Skipping...' : 'Yes'
            )

            if (wateringHour === undefined) continue

            const isHourPassed = now.hour() >= wateringHour
            logInfo(
                'Watering hour passed:',
                isHourPassed ? 'Yes' : 'No. Skipping...'
            )
            if (!isHourPassed) continue

            const lastLog = await DeviceLog.findOne({
                where: { deviceId },
                order: [['timestamp', 'DESC']],
            })

            const alreadyWateredToday =
                lastLog &&
                dayjs(lastLog.timestamp).format('YYYY-MM-DD') === today

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
