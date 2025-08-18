# Radiance (WIP)

This is a work in progress.

Radiance is a self-hosted, web-based music streaming server with a **React** powered frontend and an **Express** powered backend. It lets you to stream the music from your server to any device via a web browser.

## Requirements

To run or test this project, you will need:

- **Node.js** : use lts
- **npm** or `pnpm` / `yarn` as alternatives
- **sqlite3**
- A music folder organized as such : folder > artist > album > song+cover

> Make sure you're in a UNIX-compatible environment (Linux/macOS/WSL) for consistent file path and CLI behavior.

## How to test it ?

Run ```npm install``` in both frontend and backend directories.

Run ```npm run dev``` in both frontend and backend directories.

Go to ```http://localhost:1234``` to test.