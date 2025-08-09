import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import { log, logInfo, logError } from './logger.js'

const port = new SerialPort({
    path: '/dev/ttyUSB0', // TODO: remove hardcoded value, use env
    baudRate: 9600,
    autoOpen: false,
})

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

// TODO: retrying mechanism
port.open((err) => {
    if (err) {
        logError('Failed to open port:', err.message)
    } else {
        logInfo('Serial port open')
    }
})

parser.on('data', (line) => {
    logInfo(line)
})

export const sendToArduino = (commandStr) => {
    return new Promise((resolve, reject) => {
        if (!port.isOpen) {
            return reject(new Error('Serial port not open'))
        }

        logInfo(`Sending command to pump: ${commandStr}`)

        port.write(commandStr + '\n', (err) => {
            if (err) {
                return reject(err)
            }
            port.drain(resolve) // ensure data is fully flushed
        })
    })
}
