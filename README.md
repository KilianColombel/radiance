# Radiance (WIP)

This is a work in progress.

Radiance is a self-hosted, web-based music streaming server with a **React** powered frontend. It lets you to stream the music from your server to any device.

---

## Requirements

To run or test this project, you will need:

- **Node.js** : use lts
- **npm** or `pnpm` / `yarn` as alternatives
- **sqlite3**
- A music folder organized as such : folder > artist > album > song+cover

> Make sure you're in a UNIX-compatible environment (Linux/macOS/WSL) for consistent file path and CLI behavior.

---

## External packages

[react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)

[rc-slider](https://github.com/schrodinger/rc-slider)

[react-router-dom](https://github.com/remix-run/react-router)

## How to test it ?

Run ```npm install``` in both frontend and backend directories.

Run ```npm run dev``` in the frontend folder.

Run ```node ./index.js``` in the backend folder.