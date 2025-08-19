// Set to false to disable Mock service worker when running dev server
const MOCK_MODE = false

export const isProd = !MOCK_MODE || import.meta.env.MODE !== 'development'
