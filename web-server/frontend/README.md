# Watering Dashboard frontend

This is the frontend part of the web server intended to monitor and control small terrace watering system. The idea is to use the dashboard to monitor soil moisture and to adjust/control Arduino-powered watering pump.

This project was bootstraped using the Vite CLI tool, with React and VanillaJS. TailwindCSS is used for styling. In development, communication with backend is mocked by using the Mock Service Worker.

## TODO

### Code improvements

1. Add dark/light theme
2. Add absolute imports
3. Clean tailwind classes if possible, remove clutter that doesn't style
4. Improve fetching and refetch when needed (Tanstack Query)
5. Use Zustand for app global state
6. Add simple JSDoc to components and function
7. Improve ESLint rules
8. Make sensor extra section more flexible (extract log data no matter what is there)
9. Extract reusable components (separate tailwind improved components and sections)
    - inputs
    - basic parts
    - bigger sections
10. Define PropTypes
11. Introduce Typescript

### Feature improvements

1. Extend settings section for pump (communication type, connection address)
2. Add functionality for creating and deleting existing devices
3. Improve visuals
    - buttons (hover, selected pseudoclasses - save for settings, start watering)
    - make modal and teble a bit nicer
4. Disable watering button when watering starts, keep it this way until some defined timeout (maybe watering duration)
5. Add SSE
    - consume SSE to push notifications and refetch data
6. Add visualization (spinner) for loading, sending request
7. Improve Logs table (more columns)
8. Improve Pump settings - additional fields
9. Add Sign-in/Register option
