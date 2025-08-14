import { Router } from "express";
const playlistsRouter = Router();


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