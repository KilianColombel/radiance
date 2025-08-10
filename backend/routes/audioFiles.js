import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from "express";

import { playlist1 } from './music_tmp.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const audioFilesRouter = Router();


audioFilesRouter.get('/:id', (req, res) => {
    const song = playlist1.find(song => song.id == req.params.id);

    if (!song) {
        return res.status(404).send('song not found');
    }

    // TODO the user should be able to choose where the songs are stored on his machine
    const filePath = path.join(__dirname, '../audio', song.audioSrc);
    console.log(filePath)

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Fichier non trouvé : ${filePath}`);
            return res.status(404).send('Fichier audio non trouvé sur le serveur.');
        }
        res.sendFile(filePath);
    });
})

export default audioFilesRouter;