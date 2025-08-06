import cron from 'node-cron'
import { Device, DeviceLog } from '../models/index.js'
import { SERVER_URL, ROUTE_URLS } from '../helpers/constants.js'
import dayjs from 'dayjs'

cron.schedule('*/30 * * * *', async () => {
    console.log('🔄 Running pump scheduler job...')

    try {
        const pumps = await Device.findAll({
            where: {
                type: 'pump',
                settings: {
                    manualMode: false,
                },
            },
        })
        // console.log('pumps found', pumps)
        const now = dayjs()
        const today = now.format('YYYY-MM-DD')

        for (const pump of pumps) {
            const { deviceId, settings } = pump
            const { wateringHour, waterInterval } = settings

            // Skip if wateringHour isn't set
            if (wateringHour === undefined) continue

            const isHourPassed = now.hour() >= wateringHour

            if (!isHourPassed) continue

            // Check if already watered today
            const lastLog = await DeviceLog.findOne({
                where: { deviceId },
                order: [['timestamp', 'DESC']],
            })

            const alreadyWateredToday =
                lastLog &&
                dayjs(lastLog.timestamp).format('YYYY-MM-DD') === today
            console.log('already watered:', alreadyWateredToday)
            if (!alreadyWateredToday) {
                console.log(`🚿 Starting watering for ${deviceId}`)

                await fetch(`${SERVICE_URL}${ROUTE_URLS.START_WATERING}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        command: 'WATER',
                        duration: waterInterval || 10000,
                    }),
                })
            } else {
                console.log(`✅ Already watered today: ${deviceId}`)
            }
        }
    } catch (err) {
        console.error('❌ Error in pump scheduler:', err)
    }
})
