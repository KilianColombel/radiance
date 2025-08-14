import { Router } from "express";
const playlistsRouter = Router();

import { getTracksFromPlaylist } from "../../database/getDataFromDatabase.js";


playlistsRouter.get('/:name', async (req, res) => {
  try {
    const tracks = await getTracksFromPlaylist(req.params.name);
    res.json(tracks);
    console.log("sent playlist data for playlist : ", playlistName)
  } catch (err) {
    console.error(err);
    res.status(500).json({error : "couldn't retrieve playlist data from the database"})
  }
})

export default playlistsRouter;