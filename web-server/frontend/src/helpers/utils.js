import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const formatTimeFromNow = (timestamp) => {
    if (!dayjs(timestamp).isValid()) return 'N/A'

    return `${dayjs(timestamp).format('YYYY-MM-DD HH:mm')} (${dayjs(
        timestamp
    ).fromNow()})`
}
