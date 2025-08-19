import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Plant Watering API',
            version: '1.0.0',
        },
    },
    apis: [
        path.join(__dirname, '..routes/*.js'),
        path.join(__dirname, './*.yml'),
    ],
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwagger = (app) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
