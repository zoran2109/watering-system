/* eslint-disable no-unused-vars */

/**
 * 'Abstract' class used for watering strategy implementations
 */
export class WateringStrategy {
    async send(commandStr) {
        throw new Error('send() must be implemented by subclass')
    }
}
