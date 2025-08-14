import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const databasePath = path.join(__dirname, 'radiance.db');


export async function getAllTracks() {
  const db = await open({
    filename: databasePath,
    driver: sqlite3.Database
  });

  try {
    const res = await db.all(
      `SELECT * from track_infos 
       JOIN playlists_tracks 
       ON playlists_tracks.track_id = track_infos.track_id;`
    );
    for (let i = 0; i < res.length; i++) {
      res[i].location = [res[i].artist_folder, res[i].album_folder, res[i].file_name].join("/")
    }
    db.close();
    return res;
  } catch (err) {
    console.error("couldn't retrieve the data from the database : ", err);
    db.close();
    return null;
  }
}
// getAllTracks().then(data => console.log(data))

export async function getTracksFromPlaylist(playlistName) {  
  const db = await open({
    filename: databasePath,
    driver: sqlite3.Database
  });

  try {
    const res = await db.all(
      `SELECT * from track_infos 
       JOIN playlists_tracks ON playlists_tracks.track_id = track_infos.track_id
       JOIN playlists ON playlists.id = playlists_tracks.playlist_id
       WHERE playlists.name = ?;`,
       [playlistName]
    );
    for (let i = 0; i < res.length; i++) {
      res[i].location = [res[i].artist_folder, res[i].album_folder, res[i].file_name].join("/")
    }
    db.close();
    return res;
  } catch (err) {
    console.error("couldn't retrieve the data from the database : ", err);
    db.close();
    return null;
  }
}
// getTracksFromPlaylist("test_playlist").then(data => console.log(data))

export async function getFavoriteTracks(userID) {
  const db = await open({
    filename: databasePath,
    driver: sqlite3.Database
  });

  try {
    const res = await db.all(
      `SELECT * from track_infos 
       JOIN favorite_tracks 
       ON favorite_tracks.track_id = track_infos.track_id
       WHERE favorite_tracks.user_id = ?;`,
       [userID]
    );
    for (let i = 0; i < res.length; i++) {
      res[i].location = [res[i].artist_folder, res[i].album_folder, res[i].file_name].join("/")
    }
    db.close();
    return res;
  } catch (err) {
    console.error("couldn't retrieve the data from the database : ", err);
    db.close();
    return null;
  }
}
// getFavoriteTracks(1).then(data => console.log(data))
