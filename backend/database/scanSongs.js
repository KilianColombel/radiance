import { promises as fs } from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
});

// TODO : FIND A WAY TO NOT ADD DUPLICATES AND REMOVE THIS
await db.exec(
    `DROP TABLE tracks;
     DROP TABLE artists;
     DROP TABLE albums;
     DROP TABLE genres;`
);
// END OF THINGS TO REMOVE

async function setupDb() {

    // tracks table
    await db.exec(
        `CREATE TABLE IF NOT EXISTS tracks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            favorited BOOLEAN NOT NULL,
            duration INTEGER NOT NULL,
            track_artist TEXT,
            track_album TEXT,
            UNIQUE(name, track_artist, track_album)
        );`
    );

    // artists table
    await db.exec(
        `CREATE TABLE IF NOT EXISTS artists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            favorited BOOLEAN NOT NULL,
            born TEXT,
            founded INTEGER,
            country TEXT,
            wiki TEXT,
            UNIQUE(name)
        );`
    )

    // albums table
    await db.exec(
        `CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            favorited BOOLEAN NOT NULL,
            year INTEGER,
            wiki TEXT,
            length INTEGER,
            UNIQUE(name)
        );`
    )

    // genres table
    await db.exec(
        `CREATE TABLE IF NOT EXISTS genres (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            wiki TEXT,
            UNIQUE(name)
        );`
    )

    // TODO manage playlists somewhere else
    // TODO how to manage them if there's multiple users ? JSON ?
    // TODO same goes for favorites...
    return db;
}
setupDb();

async function addTrack(name, duration, track_artist, track_album) {
  try {
    const result = await db.run(
      `INSERT INTO tracks (name, favorited, duration, track_artist, track_album) 
       VALUES (?, ?, ?, ?, ?);`,
      [name, false, duration, track_artist, track_album]
    );
    console.log(`track "${name}" added with id : ${result.lastID}`);
  } catch (error) {
    console.error(`couldn't add track "${name}" :`, error);
  } 
}

async function addArtist(name, born, founded, country, wiki) {
  try {
    const result = await db.run(
      `INSERT INTO artists (name, favorited, founded, country, wiki) 
       VALUES (?, ?, ?, ?, ? , ?);`,
      [name, false, born, founded, country, wiki]
    );
    console.log(`artist "${name}" added with id : ${result.lastID}`);
  } catch (error) {
    console.error(`couldn't add artist "${name}" :`, error);
  } 
}

async function addAlbum(name, year, wiki, length) {
  try {
    const result = await db.run(
      `INSERT INTO albums (name, favorited, year, wiki, length) 
       VALUES (?, ?, ?, ?, ?);`,
      [name, false, year, wiki, length]
    );
    console.log(`album "${name}" added with id : ${result.lastID}`);
  } catch (error) {
    console.error(`couldn't add album "${name}" :`, error);
  } 
}

async function addGenre(name, wiki) {
  try {
    const result = await db.run(
      `INSERT INTO genres (name, wiki) 
       VALUES (?, ?);`,
      [name, wiki]
    );
    console.log(`genre "${name}" added with id : ${result.lastID}`);
  } catch (error) {
    console.error(`couldn't add track "${name}" :`, error);
  } 
}
await addTrack("aurora", 279, "björk", "vespertine")
await addArtist("björk", null, "1965-11-21", "iceland", "björk's wiki")
await addAlbum("vespertine", 2001, "verpertine's wiki", 3341)
await addGenre("electronic", "electronic's wiki")

await addTrack("man in the box", 286, "alice in chains", "facelift")
await addArtist("alice in chains", 1987, null, "usa", "alice in chains's wiki")
await addAlbum("facelift", 1990, null, 3251)
await addGenre("grunge", "grunge's wiki")



const musicDirectory = '../../../music'; 
// the music directory should look like this :
// music_folder/
//   L artist_folder/
//     L album_folder/
//       L song1.*
//       L song2.*
//       ...

async function scanMusicFiles(dir) {
    try {
        const artists = await fs.readdir(dir, { withFileTypes: true });

        for (const artist of artists) {
            if (artist.isDirectory()) {
                try {
                    const artistName = artist.name; // the name of the folder : chosen by the user so that it doesn't depend on the files metadata
                    const artistPath = path.join(dir, artistName);
                    const albums = await fs.readdir(artistPath, { withFileTypes: true });
    
                    for (const album of albums) {
                        if (album.isDirectory()) {
                            try {
                                const albumName = album.name; // same here...
                                const albumPath = path.join(artistPath, albumName);
                                const tracks = await fs.readdir(albumPath, { withFileTypes: true });
        
                                for (const track of tracks) {
                                    if (track.isFile()) {
                                        const filePath = path.join(albumPath, track.name);
                                        
                                        if (["mp3", "flac"].includes(filePath.split(".").pop().toLocaleLowerCase())) { // TODO add all the extensions allowed by music-metatdata
                                            try {
                                                const metadata = await parseFile(filePath, { duration: true });
                
                                                console.log('---');
                                                console.log(`title    : ${metadata.common.title}`);
                                                console.log(`artist   : ${metadata.common.albumartist || metadata.common.artist}`); // this is the artist name related to the metadata; no idea what to do with it. 
                                                                                                                                    // TODO there is more to do here because of multiple artists tracks (separated by symbols like | or & ...)
                                                console.log(`album    : ${metadata.common.album}`);  // same for the album
                                                console.log(`duration : ${secondsToString(metadata.format.duration)}`);
                                            } catch(err) { 
                                                console.log("couldn't read music file", err)    
                                            }
                                        }
                                        else {
                                            /* test if it's an image : then it's probably the album cover
                                               TODO : how to add it to the front end */
                                        }
                                    }
                                }
                            } catch(err) {
                                console.log("couldn't read album folder", err);
                            }
                        }
                    }
                } catch(err) {
                    console.log("couldn't read artist folder", err);
                }
            }
        }
    } catch(err) { // TODO maybe should divide this in other catches because right now, if one file fails, everything fails
        console.error("couldn' read main folder", err);
    } finally {
        await db.close();
    }
}

// copied from frontend...
export function secondsToString(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

scanMusicFiles(musicDirectory);