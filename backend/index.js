import express from 'express';
import cors from 'cors';
import fs from 'fs';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import dotenv from "dotenv";
dotenv.config();

import { scanMusicFiles } from './database/scanFolder.js';


const app = express();
const port = 1234;
// TODO maybe restrict the allowed domains or something...
app.use(cors());
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (process.env.NODE_ENV === "development") {
  var musicPath = process.env.MUSIC_PATH;
} else {
  const configPath = path.join(__dirname, 'config.json');
  var musicPath = JSON.parse(fs.readFileSync(configPath, 'utf-8')).musicDirectory;
}

await scanMusicFiles(musicPath)
// the music directory should look like this :
// music_folder/
//   L artist_folder/
//      L album_folder/
//         L song1.*
//         L song2.*
//       ...

// api 

process.on('uncaughtException', (err) => {
  console.error('Erreur non capturée:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejet non géré:', reason);
});

import apiRouter from './routes/api.js'
app.use('/api', apiRouter)

app.listen(port, () => {
  console.log(`${process.env.NODE_ENV} : server started at : http://localhost:${port}`);
});