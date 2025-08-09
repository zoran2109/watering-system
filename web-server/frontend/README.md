# Watering Dashboard frontend

This is the frontend part of the web server intended to monitor and control small terrace watering system. The idea is to use the dashboard to monitor soil moisture and to adjust/control Arduino-powered watering pump.

This project was created using the Vite CLI command, with React and VanillaJS. TailwindCSS is used for styling. In development, communication with backend is mocked using Mock Service Worker.

## TODO

-   clean tailwind classes if possible, remove clutter that doesn't style
-   improve visuals: buttons (hover, selected pseudoclasses - save for settings, start watering), make modal a bit nicer
-   disable watering button when watering starts, keep it this way until some defined timeout (watering duration?)
-   add spinner for loading, sending request
-   extract reusable input components, basic parts, bigger parts
-   improve fetching function and refetching when needed (Tanstack Query)
-   add ESLint config and simple JSDoc

-   consume SSE to push notifications and refetch data (always open?)
-   add option for creating/deleting devices
-   add light theme and theme switching button
