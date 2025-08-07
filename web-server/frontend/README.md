# Watering Dashboard frontend

This is the frontend part of the web server intended to monitor and control small terrace watering system. The idea is to use the dashboard to monitor soil moisture and to adjust/control Arduino-powered watering pump.

This project was created using the Vite CLI command, with React and VanillaJS. TailwindCSS is used for styling. In development, communication with backend is mocked using Mock Service Worker.

## TODO

-   clean tailwind classes if possible, remove clutter
-   add slider on modal window component
-   improve buttons (save, start watering) - add animation, etc.
-   disable watering button when watering starts for watering duration?
-   add spinner for loading
-   extract reusable input component
-   improve fetching function and refetching when needed (lib?)
-   add simple JSDoc

-   use SSE to push notifications and refetch data
-   add light theme and theme switching
-   editing sensors
-   add creating/deleting devices
