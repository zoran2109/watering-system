export class WateringStrategy {
    async send(commandStr) {
        throw new Error('send() must be implemented by subclass')
    }
}
