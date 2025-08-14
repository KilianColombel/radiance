import { Router } from "express";
const playlistsRouter = Router();


const musicPath = "../../music";

const playlist1 = [
  { id: 1, title: 'Island In The Sun', artist: 'Weezer', album: 'Weezer', duration: '3:20', isFavorite: false, audioSrc: `${musicPath}/Island In The Sun.mp3` },
  { id: 2, title: 'Stuck In The Middle With You', artist: 'Stealers Wheel', album: 'Stealers Wheel', duration: '3:29', isFavorite: true, audioSrc: `${musicPath}/Stuck In The Middle With You.flac` },
  { id: 3, title: 'This Must Be the Place', artist: 'Talking Heads', album: 'Speaking in Tongues', duration: '4:56', isFavorite: false, audioSrc: `${musicPath}/This Must Be the Place (Naive Melody).flac` },
  { id: 4, title: 'Cloud Nine', artist: 'George Harrison', album: 'Cloud Nine', duration: '3:17', isFavorite: false, audioSrc: `${musicPath}/Cloud Nine.mp3` },
  { id: 5, title: 'Lovefool', artist: 'The Cardigans', album: 'First Band On The Moon', duration: '3:14', isFavorite: false, audioSrc: `${musicPath}/Lovefool.flac` },
];

const playlist2 = [
  { id: 1, title: 'Wide Open Wound', artist: 'Nails', album: 'Abandon All Life', duration: '3:38', isFavorite: false },
  { id: 2, title: 'Boiled Angel', artist: 'Dragged Into Sunlight', album: 'Hatred For Mankind', duration: '4:23', isFavorite: true },
  { id: 3, title: 'Global Warming', artist: 'Gojira', album: 'From Mars to Sirius', duration: '7:50', isFavorite: false },
  { id: 4, title: 'Dam That River', artist: 'Alice In Chains', album: 'Dirt', duration: '3:09', isFavorite: false },
  { id: 5, title: 'Body Behavior', artist: 'Deafheaven', album: 'Lonely People With Power', duration: '5:23', isFavorite: false },
];

playlistsRouter.get('/:id', (req, res) => {
  switch (req.params.id) {
    case "example-1":
      res.json(playlist1);
      console.log("1")
      break;
    
    case "example-2":
      res.json(playlist2);
      console.log("2")
      break
  
    default:
      console.log("erreur")
      res.status(404).json({message: "error"})
      break;
  }
})

export default playlistsRouter;