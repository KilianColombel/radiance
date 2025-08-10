const path = require('path');
const { Router } = require("express");
const audioFilesRouter = Router();

const musicPath = "../../music";

const playlist1 = [
  { id: 1, title: 'Island In The Sun', artist: 'Weezer', album: 'Weezer', duration: '3:20', isFavorite: false, audioSrc: `${musicPath}/Island in the Sun.mp3` },
  { id: 2, title: 'Stuck In The Middle With You', artist: 'Stealers Wheel', album: 'Stealers Wheel', duration: '3:29', isFavorite: true, audioSrc: `${musicPath}/Stuck In The Middle With You.flac` },
  { id: 3, title: 'This Must Be the Place', artist: 'Talking Heads', album: 'Speaking in Tongues', duration: '4:56', isFavorite: false, audioSrc: `${musicPath}/This Must Be the Place (Naive Melody).flac` },
  { id: 4, title: 'Cloud Nine', artist: 'George Harrison', album: 'Cloud Nine', duration: '3:17', isFavorite: false, audioSrc: `${musicPath}/Cloud Nine.mp3` },
  { id: 5, title: 'Lovefool', artist: 'The Cardigans', album: 'First Band On The Moon', duration: '3:14', isFavorite: false, audioSrc: `${musicPath}/Lovefool.flac` },
];

audioFilesRouter.get('/:id', (req, res) => {
    const songSrc = playlist1.find(song => song.id == req.params.id).audioSrc;

    const filePath = path.join(__dirname, '../audio', songSrc);
    console.log(filePath)

    res.sendFile(filePath, (err) => {
        if (err) {
            console.log(err);
            res.status(404).send("file not found")
        }
    })
})

module.exports = audioFilesRouter;