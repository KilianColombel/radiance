import { Router } from "express";
const apiRouter = Router();

import { getAllTracks } from "../database/getDataFromDatabase.js";

apiRouter.get('/tracks', async (req, res) => {
  try {
    const tracks = await getAllTracks();
    res.json(tracks);
  } catch (err) {
    console.error(err);
    res.status(500).json({error : "couldn't retrieve tracks data from database"});
  }
})

import playlistsRouter from "./api/playlists.js";
apiRouter.use("/playlist", playlistsRouter);

import audioFilesRouter from "./api/audioFiles.js";
apiRouter.use("/audio", audioFilesRouter);

export default apiRouter;