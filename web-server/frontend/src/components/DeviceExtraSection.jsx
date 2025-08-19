import { startWatering } from '../api/client'
import { formatTimeFromNow, convertUtcHourToLocal } from '../helpers/utils'

export const PumpExtraSection = ({ pumpData }) => {
    const { settings, lastLog, deviceId } = pumpData
    const { manualMode, wateringDuration, wateringHour } = settings

    return (
        <>
            <p className="text-sm text-white/60 mb-2">
                {manualMode ? 'Manual' : 'Automatic'} mode
            </p>
            <p className="text-sm text-white/60 mb-2">
                Last watered: {formatTimeFromNow(lastLog?.timestamp || {})}
            </p>
            <p className="text-sm text-white/60 mb-2">
                Watering duration: {wateringDuration} ms
            </p>
            {manualMode ? (
                <>
                    <div className="flex flex-row-reverse my-2">
                        <button
                            className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                                startWatering(deviceId, wateringDuration)
                            }
                        >
                            Start Watering
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-sm text-white/60 mb-2">
                        Watering hour: {convertUtcHourToLocal(wateringHour)} h
                    </p>
                </>
            )}
        </>
    )
}

export const SensorExtraSection = ({ sensorData }) => {
    const { lastLog } = sensorData
    return (
        <>
            <p className="text-sm text-white/60 mb-2">
                Last reading: {formatTimeFromNow(lastLog?.timestamp || {})}
            </p>
            <p className="text-sm text-white/60 mb-2">
                Moisture level: {lastLog?.logData?.moisture || 'N/A'}
            </p>
        </>
    )
}
