import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import { logInfo, logError } from '../../helpers/logger.js'
import { WateringStrategy } from './WateringStrategy.js'
import { jobMonitor } from '../../jobs/JobMonitor.js'

export class SerialWateringStrategy extends WateringStrategy {
    constructor(portPath = '/dev/ttyUSB0', baudRate = 9600) {
        super()
        this.portPath = portPath
        this.baudRate = baudRate
    }

    async send(command) {
        const { command: cmd, duration, deviceId } = command
        const commandStr = `${cmd} ${duration}`

        jobMonitor.jobStarted(deviceId)

        return new Promise((resolve, reject) => {
            const port = new SerialPort({
                path: this.portPath,
                baudRate: this.baudRate,
                autoOpen: false,
            })

            const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

            parser.on('data', (line) => {
                logInfo('Arduino:', line)
                if (
                    line.includes('Watering done') ||
                    line.includes('Unknown command')
                ) {
                    jobMonitor.jobEnded(deviceId, true)
                }
            })

            port.open((err) => {
                if (err) return reject(err)
                logInfo(`Serial port opened for command: ${commandStr}`)

                port.write(commandStr + '\n', (err) => {
                    if (err) {
                        jobMonitor.jobEnded(deviceId, false)
                        port.close()
                        return reject(err)
                    }

                    port.drain(() => {
                        const startTime = Date.now()
                        const timeout = 3 * 60 * 1000 + 200 // 3 min + buffer
                        const interval = setInterval(() => {
                            if (!jobMonitor.isBusy(deviceId)) {
                                clearInterval(interval)
                                parser.removeAllListeners('data')
                                port.close(() =>
                                    resolve('Closing serial port...')
                                )
                            } else if (Date.now() - startTime > timeout) {
                                clearInterval(interval)
                                parser.removeAllListeners('data')
                                jobMonitor.jobEnded(deviceId, false)
                                port.close(() =>
                                    reject(
                                        new Error(
                                            'Timeout while waiting for Arduino message. Closing serial port...'
                                        )
                                    )
                                )
                            }
                        }, 100)
                    })
                })
            })
        })
    }
}
