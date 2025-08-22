import { DeviceCard } from '../components/DeviceCard'
import {
    PumpExtraSection,
    SensorExtraSection,
} from '../components/DeviceExtraSection'

const Devices = ({ devices, openLogs, openSettings }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {devices.map((device) => (
            <DeviceCard
                key={device.deviceId}
                data={device}
                onLogsClick={openLogs}
                onSettingsClick={openSettings}
            >
                {device.type === 'pump' ? (
                    <PumpExtraSection pumpData={device} />
                ) : (
                    <SensorExtraSection sensorData={device} />
                )}
            </DeviceCard>
        ))}
    </div>
)

export default Devices
