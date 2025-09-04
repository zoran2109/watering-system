# Watering Dashboard frontend

This is the frontend part of the web server intended to monitor and control small terrace watering system. The idea is to use the dashboard to monitor soil moisture and to adjust/control Arduino-powered watering pump.

This project was bootstraped using the Vite CLI tool, with React and VanillaJS. TailwindCSS is used for styling. In development, communication with backend is mocked by using the Mock Service Worker.

## TODO

### Code improvements

1. Add absolute imports
2. Clean tailwind classes if possible, remove clutter that doesn't style
3. Improve fetching and refetch when needed (Tanstack Query)
4. Use Zustand for app global state
5. Add simple JSDoc to components and function
6. Improve ESLint rules
7. Make sensor extra section more flexible (extract log data no matter what is there)
8. Extract reusable components (separate tailwind improved components and sections)
    - inputs
    - basic parts
    - bigger sections
9. Define PropTypes
10. Introduce Typescript

### Feature improvements

1. Add dark/light theme
2. Extend settings section for pump (communication type, connection address)
3. Add functionality for creating and deleting existing devices
4. Improve visuals
    - buttons (hover, selected pseudoclasses - save for settings, start watering)
    - make modal and teble a bit nicer
5. Disable watering button when watering starts, keep it this way until some defined timeout (maybe watering duration)
6. Add SSE
    - consume SSE to push notifications and refetch data
7. Add visualization (spinner) for loading, sending request
8. Improve Logs table (more columns)
9. Improve Pump settings - additional fields
10. Add Sign-in/Register option
