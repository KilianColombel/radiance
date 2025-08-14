import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Router } from "express";
const audioFilesRouter = Router();

import { getTrackByID } from '../../database/getDataFromDatabase.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const configPath = path.join(__dirname, '..', '..', 'config.json');
const musicDirectory = JSON.parse(fs.readFileSync(configPath, 'utf-8')).musicDirectory;

audioFilesRouter.get('/:id', async (req, res) => {
    try {
        const song = await getTrackByID(req.params.id);
        
        const filePath = path.join(musicDirectory, song.location);
    
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error("file not found : ", filePath);
                return res.status(404).send('file not found on server');
            }
            res.sendFile(filePath);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "couldn't retrieve track data form the database"})
    }


})

export default audioFilesRouter;