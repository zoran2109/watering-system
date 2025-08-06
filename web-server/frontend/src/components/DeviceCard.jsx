import { deviceIconPaths, UIIconPaths } from '../assets/icons'

export const DeviceCard = ({
    data,
    onLogsClick,
    onSettingsClick,
    children,
}) => (
    <div className="bg-[#1e1e1e] border border-white/10 p-4 rounded-xl shadow text-white w-full">
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
                <img
                    src={deviceIconPaths[data.type]}
                    alt={`${data.type} icon`}
                    className="h-15 w-15"
                />
                <h3 className="text-lg font-semibold">{data.name}</h3>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onLogsClick(data.deviceId)}
                    className="p-2 rounded hover:bg-white/10 transition cursor-pointer"
                    title="View Logs"
                >
                    <img
                        src={UIIconPaths.logs}
                        alt="Logs icon"
                        className="h-6 w-6"
                    />
                </button>
                {data.type === 'pump' && (
                    <button
                        onClick={() => onSettingsClick(data.deviceId)}
                        className="p-2 rounded hover:bg-white/10 transition cursor-pointer"
                        title="Settings"
                    >
                        <img
                            src={UIIconPaths.settings}
                            alt="Settings icon"
                            className="h-6 w-6"
                        />
                    </button>
                )}
            </div>
        </div>

        <div className="flex flex-col items-start justify-between my-3 mx-5">
            <p className="text-sm text-white/60 mb-2">
                Device type: {data.type}
            </p>

            {children}
        </div>
    </div>
)
