import express from 'express';
import cors from 'cors';
import fs from 'fs';

import { scanMusicFiles } from './database/scanFolder.js';

const app = express();

const port = 1234;
// TODO maybe restrict the allowed domains or something...
app.use(cors());
app.use(express.json());


const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
// TODO this should be an api call and the location chosen from frontend
await scanMusicFiles(config.musicDirectory)
// the music directory should look like this :
// music_folder/
//   L artist_folder/
//      L album_folder/
//         L song1.*
//         L song2.*
//       ...

// api 
import playlistsRouter from "./routes/playlists.js";
app.use("/api/playlist", playlistsRouter);
import audioFilesRouter from "./routes/audioFiles.js";
app.use("/api/audio", audioFilesRouter);

app.listen(port, () => {
  console.log(`server started at : http://localhost:${port}`);
});