const express = require('express');
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

// api 
const trackListRouter = require("./routes/trackList");
app.use("/api/playlist", trackListRouter);
const audioFilesRouter = require("./routes/audioFiles");
app.use("/api/audio", audioFilesRouter);

app.listen(port, () => {
  console.log(`server started at : http://localhost:${port}`);
});