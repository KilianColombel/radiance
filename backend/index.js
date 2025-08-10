import express from 'express';
import cors from 'cors';

const app = express();

const port = 1234;
// TODO maybe restrict the allowed domains or something...
app.use(cors());
app.use(express.json());

// api 
import trackListRouter from "./routes/trackList.js";
app.use("/api/playlist", trackListRouter);
import audioFilesRouter from "./routes/audioFiles.js";
app.use("/api/audio", audioFilesRouter);

app.listen(port, () => {
  console.log(`server started at : http://localhost:${port}`);
});