import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

export const formatTimeFromNow = (timestamp) => {
    if (!dayjs(timestamp).isValid()) return 'N/A'

    return `${dayjs(timestamp).format('YYYY-MM-DD HH:mm')} (${dayjs(
        timestamp
    ).fromNow()})`
}

export const formatTimeForLogs = (timestamp) =>
    dayjs(timestamp).format('DD-MM-YYYY HH:mm')

export const convertUtcHourToLocal = (hour) =>
    dayjs.utc().hour(hour).local().hour()

export const convertLocalHourToUtc = (hour) => dayjs().hour(hour).utc().hour()
