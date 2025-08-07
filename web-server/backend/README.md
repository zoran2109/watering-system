# Watering Dashboard backend

This is the backend part of the web application intended to monitor and control small terrace watering system. The idea is to use the dashboard to monitor soil moisture and to control/adjust watering pump. Devices and device (moisture and watering) logs are stored to the database.

The backend is made in Vanilla JS using Node.js and Express. Sequalize is used for data models and SQLite for DB.

## TODO

-   introduce better logging
-   document code (JSDoc?), improve Swagger UI
-   remove hardcoded values and make things modular
-   add response schema and request validation (zod)?

-   introduce SSE for real-time notifications when watering is done or something is stored to the database
