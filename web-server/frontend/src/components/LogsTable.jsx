export const LogsTable = ({ logs }) => (
    <table className="min-w-full text-sm text-left border border-border text-text-main mt-5">
        <thead className="bg-bg-muted text-text-muted">
            <tr>
                <th className="px-4 py-2 border-b border-border">Time</th>
                <th className="px-4 py-2 border-b border-border">Log Data</th>
            </tr>
        </thead>
        <tbody>
            {logs.length === 0 ? (
                <tr>
                    <td
                        colSpan={6}
                        className="px-4 py-2 border-b border-border text-center"
                    >
                        No logs available!
                    </td>
                </tr>
            ) : (
                logs.map((log) => (
                    <tr key={log.id} className="hover:bg-bg-hover">
                        <td className="px-4 py-2 border-b border-border">
                            {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 border-b border-border">
                            {log.logData.moisture !== undefined
                                ? `Moisture: ${log.logData.moisture}`
                                : `Watered: ${log.logData.duration} ms`}
                        </td>
                    </tr>
                ))
            )}
        </tbody>
    </table>
)
