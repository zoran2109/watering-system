import { setupWorker } from 'msw/browser'
import { handlers } from './handlers.js'
import { isProd } from './app.config.js'

const worker = setupWorker(...handlers)

export async function enableMockingIfNotProd() {
    if (isProd) {
        return
    }

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start()
}
