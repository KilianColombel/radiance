import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: './database/radiance.db',
  driver: sqlite3.Database
});

export async function getAllTracks() {
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

export async function getTracksFromPlaylist(playlistID) {  
  try {
    const res = await db.all(
      `SELECT * from track_infos 
       JOIN playlists_tracks 
       ON playlists_tracks.track_id = track_infos.track_id
       WHERE playlists_tracks.playlist_id = ?;`,
       [playlistID]
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
// getTracksFromPlaylist(1).then(data => console.log(data))

export async function getFavoriteTracks(userID) {
  const db = await open({
    filename: './database/radiance.db',
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
