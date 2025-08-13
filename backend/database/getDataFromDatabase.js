import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


export async function getAllTracks() {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });
  
  try {
    /* SELECT tracks.name, artists.folder_name, albums.folder_name, tracks.duration FROM tracks JOIN tracks_artists ON tracks_artists.track_id = tracks.id JOIN artists ON tracks_artists.artist_id = artists.id JOIN artists_albums ON artists_albums.artist_id = artists.id JOIN albums ON artists_albums.album_id = albums.id; */
    const res = await db.all(
      `SELECT tracks.name, artists.folder_name AS artist, albums.folder_name AS album, tracks.duration, tracks.file_name AS location FROM tracks
       JOIN tracks_artists ON tracks_artists.track_id = tracks.id
       JOIN artists ON tracks_artists.artist_id = artists.id
       JOIN artists_albums ON artists_albums.artist_id = artists.id
       JOIN albums ON artists_albums.album_id = albums.id;`
    );
    for (let i = 0; i < res.length; i++) {
      res[i].location = [res[i].artist, res[i].album, res[i].location].join("/")
    }
    res.forEach(track => {
    });
    return res;
  } catch (err) {
    console.error("couldn't retrieve the data from the database : ", err);
    return null;
  }
}

getAllTracks().then(data => console.log(data))