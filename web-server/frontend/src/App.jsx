import { useState, useEffect } from 'react'
import Devices from './sections/Devices'
import Header from './sections/Header'
import Modal from './components/Modal'
import { fetchDevices, fetchDeviceLogs } from './api/client'
import { LogsTable } from './components/LogsTable'
import { Settings } from './components/Settings'
import { ToastContainer } from 'react-toastify'

/*
 * TO DO:
 *  - useAppState - app state using zustand
 *      - modalView and modal state
 *
 *  - useModalView - sets and clears / opens and closes modal
 *  - useDevices, useRefetchDevices - handles fetching and refetching of centralized state
 *
 *  - <Loader /> if there is ongoing fetching (import { useIsFetching, useIsMutating } from "@tanstack/react-query";)
 */

const App = () => {
    const [devices, setDevices] = useState([])
    const [modalView, setModalView] = useState(null)
    const [refetch, toggleRefetch] = useState(false)

    useEffect(() => {
        fetchDevices().then((respJson) => setDevices(respJson))
    }, [refetch])

    const openLogs = async (deviceId) =>
        fetchDeviceLogs(deviceId).then((respJson) =>
            setModalView(
                <div className="max-h-[60vh] overflow-y-auto">
                    <LogsTable logs={respJson} />
                </div>
            )
        )

    const openSettings = (deviceId) => {
        const device = devices.filter(
            (device) => device.deviceId === deviceId
        )[0]
        const initialData = {
            name: device.name,
            manualMode: device.settings.manualMode,
            duration: device.settings.wateringDuration,
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
            <Header />

            <Devices
                devices={devices}
                openSettings={openSettings}
                openLogs={openLogs}
            />

            <Modal open={Boolean(modalView)} onClose={() => setModalView(null)}>
                {modalView}
            </Modal>

            <ToastContainer theme="dark" autoClose={3000} />
        </>
    )
}

export default App
