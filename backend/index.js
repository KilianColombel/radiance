const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// api 
const trackListRouter = require("./routes/trackList")
app.use("/", trackListRouter);


const PORT = 1234;
app.listen(PORT, () => {
  console.log(`server started at : http://localhost:${PORT}`);
});