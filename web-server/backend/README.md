# Watering Dashboard backend

This is the backend part of the web application intended to monitor and control small terrace watering system. The idea is to use the dashboard to monitor soil moisture and to control/adjust watering pump. Devices and device (moisture and watering) logs are stored to the database.

The backend is made in Vanilla JS using Node.js and Express. Sequalize is used for data models and SQLite for DB.

## TODO

### Code improvements

1. Use 'zod' consistently
    - Add zod device log schema
    - use zod api model validation on endpoints (control, device, deviceLogs)
2. Enable watering from start-watering endpoint only if mode is MANUAL
3. Add absolute imports
4. Improve Swagger docs
    - automate creation of Swagger docs (investigate libs)
    - make Swagger API callse work in prod (doesn't work because backend is called with added '/api' to URL)
5. Improve ESLint rules
6. Add unified response schema as middleware (object with data, meta, error fields)
7. Introduce Typescript
8. Test and 'clean' serial and wifi water strategies

### Feature improvements

1. Introduce SSE for real-time notifications to client when watering is done or something is stored to the database
2. Introduce a way to 'register' a device over MQTT if it doesn't exist
3. Introduce Sensor handler over MQTT
4. Add authentication
