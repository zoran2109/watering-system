# Watering Dashboard backend

This is the backend part of the web application intended to monitor and control small terrace watering system. The idea is to use the dashboard to monitor soil moisture and to control/adjust watering pump. Devices and device (moisture and watering) logs are stored to the database.

The backend is made in Vanilla JS using Node.js and Express. Sequalize is used for data models and SQLite for DB.

## TODO

1. use the mqtt message schema
2. create factory for watering strategies (singleton for mqtt, for other not)
3. create 'Job Monitor' class that will store watering states for pumps by deviceId (bool), call the methods (jobStarted, jobEnded) in all strategies
4. Add device log schema
5. put validation to endpoints (control, device, deviceLogs)

-   add conditional to start-watering endpoint to start watering only if mode is MANUAL
-   add absolute imports
-   add ESLint linting with JSDoc rule, document code with basic info (description, parameters with types, @returns)
-   add basic Swagger UI docs for all endpoints (follow devices.yml)
-   redirect to /docs when opening '/' in prod
-   remove hardcoded values (usb port, arduino pump), probably set port in settings
-   add unified response schema as middleware (data, meta, error)
-   and request validation (zod)
-   see how to ensure no data is deleted during rebuild of Docker container

-   introduce SSE for real-time notifications to client when watering is done or something is stored to the database
-   introduce Typescript
