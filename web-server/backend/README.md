# Watering Dashboard backend

This is the backend part of the web application intended to monitor and control small terrace watering system. The idea is to use the dashboard to monitor soil moisture and to control/adjust watering pump. Devices and device (moisture and watering) logs are stored to the database.

The backend is made in Vanilla JS using Node.js and Express. Sequalize is used for data models and SQLite for DB.

## TODO

1. Add zod log schema
2. put zod model validation to endpoints (control, device, deviceLogs)
3. add conditional to start-watering endpoint to start watering only if mode is MANUAL

-   add absolute imports
-   improve ESlint
-   automate generation of Swagger?
-   make Swagger UI work in prod?
-   add unified response schema as middleware (data, meta, error)
-   ensure no data (DB) is deleted during rebuild of Docker container?
-   introduce SSE for real-time notifications to client when watering is done or something is stored to the database
-   introduce Typescript
