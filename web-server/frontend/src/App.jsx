import { useState, useEffect } from 'react'
import { DeviceCard } from './components/DeviceCard'
import { UIIconPaths } from './assets/icons'
import Modal from './components/Modal'
import { fetchDevices, fetchDeviceLogs } from './api/client'
import {
    PumpExtraSection,
    SensorExtraSection,
} from './components/DeviceExtraSection'
import { LogsTable } from './components/LogsTable'
import { Settings } from './components/Settings'
import { ToastContainer } from 'react-toastify'

function App() {
    const [devices, setDevices] = useState([])
    const [modalView, setModalView] = useState(null)
    const [refetch, toggleRefetch] = useState(false)

    useEffect(() => {
        fetchDevices().then((respJson) => setDevices(respJson))
    }, [refetch])

    const openLogs = async (deviceId) =>
        fetchDeviceLogs(deviceId).then((respJson) =>
            setModalView(<LogsTable logs={respJson} />)
        )

    const openSettings = (deviceId) => {
        const device = devices.filter(
            (device) => device.deviceId === deviceId
        )[0]
        const initialData = {
            name: device.name,
            manualMode: device.settings.manualMode,
            interval: device.settings.waterInterval,
            hour: device.settings.wateringHour,
        }
        setModalView(
            <Settings
                deviceId={deviceId}
                initialData={initialData}
                setClose={() => {
                    setModalView(null)
                    toggleRefetch(!refetch)
                }}
            />
        )
    }
    return (
        <>
            <header className="flex items-center gap-3 p-4">
                <img
                    src={UIIconPaths.plant}
                    alt="Plant Icon"
                    className="h-8 w-8"
                />
                <h1 className="text-2xl font-bold text-text-main">
                    Watering Dashboard
                </h1>
            </header>

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

            <Modal open={Boolean(modalView)} onClose={() => setModalView(null)}>
                {modalView}
            </Modal>

            <ToastContainer theme="dark" autoClose={3000} />
        </>
    )
}

export default App
