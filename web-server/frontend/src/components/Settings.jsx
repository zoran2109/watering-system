import { useState, useEffect } from 'react'
import { updateDevice } from '../api/client'
import { convertUtcHourToLocal, convertLocalHourToUtc } from '../helpers/utils'

export const Settings = ({ deviceId, initialData, setClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        manualMode: false,
        duration: 60000,
        hour: 7,
    })

    useEffect(() => {
        setFormData({
            ...initialData,
            hour: convertUtcHourToLocal(initialData.hour),
        })
    }, [initialData])

    const save = async () => {
        const payload = {
            name: formData.name,
            settings: {
                manualMode: formData.manualMode,
                wateringDuration: formData.duration,
                wateringHour: convertLocalHourToUtc(formData.hour),
                communicationType: 'mqtt',
                connectionAddress: null,
            },
        }
        console.log(deviceId, payload)
        await updateDevice(deviceId, payload)
        setClose()
    }

    return (
        <form className="space-y-4 w-full">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text-muted mb-1"
                >
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-2 rounded border border-border bg-bg-muted text-text-main focus:outline-none focus:ring focus:ring-primary"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="manualMode"
                    checked={formData.manualMode}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            manualMode: e.target.checked,
                        })
                    }
                    className="h-4 w-4 text-primary border border-border rounded focus:ring focus:ring-primary"
                />
                <label htmlFor="manualMode" className="text-sm text-text-muted">
                    Manual Mode
                </label>
            </div>

            <div>
                <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-text-muted mb-1"
                >
                    Watering Duration (ms)
                </label>
                <input
                    type="number"
                    id="duration"
                    min={0}
                    value={formData.duration}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            duration: Number(e.target.value),
                        })
                    }
                    className="w-full p-2 rounded border border-border bg-bg-muted text-text-main focus:outline-none focus:ring focus:ring-primary"
                />
            </div>

            <div>
                <label
                    htmlFor="hour"
                    className="block text-sm font-medium text-text-muted mb-1"
                >
                    Watering Hour (0–23)
                </label>
                <input
                    type="number"
                    id="hour"
                    min={0}
                    max={23}
                    value={formData.hour}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            hour: Number(e.target.value),
                        })
                    }
                    className="w-full p-2 rounded border border-border bg-bg-muted text-text-main focus:outline-none focus:ring focus:ring-primary"
                />
            </div>

            <div className="pt-4">
                <button
                    type="button"
                    onClick={save}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
                >
                    Save
                </button>
            </div>
        </form>
    )
}
