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
      `SELECT * from track_infos;`
    );

    if (res.length <= 0) {
      throw new Error("couldn't retrieve the tracks data from the database");
    }
  
    for (let i = 0; i < res.length; i++) {
      res[i].location = [res[i].artist_folder, res[i].album_folder, res[i].file_name].join("/")
    }
    return res;
    
  } catch (err) {
    throw new Error(err);
  } finally {
    db.close();
  }
}
// getAllTracks().then(data => console.log(data.length))

export async function getTrackByID(trackID) {
  const db = await open({
    filename: databasePath,
    driver: sqlite3.Database
  });

  try {
    const res = await db.all(
      `SELECT * from track_infos 
       WHERE track_id = ?;`,
       [trackID]
    );

    if (res.length != 1) {
      throw new Error("couldn't retrieve the track data from the database");
    }
  

    res[0].location = [res[0].artist_folder, res[0].album_folder, res[0].file_name].join("/")
    
    return res[0];
    
  } catch (err) {
    throw new Error(err);
  } finally {
    db.close();
  }
}
// getTrackByID(5).then(data => console.log(data))

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
    
    if (res.length <= 0) {
      throw new Error("couldn't retrieve the playlist data from the database");
    }

    for (let i = 0; i < res.length; i++) {
      res[i].location = [res[i].artist_folder, res[i].album_folder, res[i].file_name].join("/")
    }
    return res;
    
  } catch (err) {
    throw new Error(err);
  } finally {
    db.close();
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

    if (res.length <= 0) {
      throw new Error("couldn't retrieve the favorites data from the database");
    }

    for (let i = 0; i < res.length; i++) {
      res[i].location = [res[i].artist_folder, res[i].album_folder, res[i].file_name].join("/")
    }
    return res;

  } catch (err) {
    throw new Error(err);
  } finally {
    db.close();
  }
}
// getFavoriteTracks(1).then(data => console.log(data))
