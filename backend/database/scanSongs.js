import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const musicDirectory = '../../../music'; 
// the music directory should look like this :
// music_folder/
//   L artist_folder/
//     L album_folder/
//       L song1.*
//       L song2.*
//       ...

// database creation
async function createDB() {
    const filePath = "./radiance.db";
    try {
        if (fs.existsSync(filePath)) {
            console.log("database already exists, skipping creation")
        }
        else {
            await fs.promises.writeFile(filePath, "", "utf8")
            console.log("database has been created")
        }
    } catch (err) {
        console.log("error while creating database : ", err)
    }
}
await createDB();
const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
});

async function clearDatabase() {
    await db.exec(
        `DROP TABLE IF EXISTS tracks;
         DROP TABLE IF EXISTS artists;
         DROP TABLE IF EXISTS albums;
         DROP TABLE IF EXISTS genres;
         
         DROP TABLE IF EXISTS tracks_albums
         DROP TABLE IF EXISTS tracks_artists
         DROP TABLE IF EXISTS tracks_genres
         DROP TABLE IF EXISTS artists_albums
         DROP TABLE IF EXISTS artists_genres
         DROP TABLE IF EXISTS albums_genres
         DROP TABLE IF EXISTS tracks_playlists`      
    );
}

// TODO issue with favorites for multiple users...
async function setupDb() {
    // --- TABLES ---

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


    // --- LINKS BETWEEN TABLES --- 

    // tracks_artists [0..*]<-->[1] : every track has an artist related to it (grandparent folder), but an artist folder can be empty
    await db.exec(
        `CREATE TABLE IF NOT EXISTS tracks_artists (
            track_id INTEGER NOT NULL,
            artist_id INTEGER NOT NULL,

            PRIMARY KEY (track_id, artist_id),

            FOREIGN KEY (track_id) REFERENCES tracks(id),
            FOREIGN KEY (artist_id) REFERENCES artists(id)
        );`
    )
    
    // tracks_albums [0..*]<-->[1] : every track has an album related to it (parent folder), but an album folder can be empty
    await db.exec(
        `CREATE TABLE IF NOT EXISTS tracks_albums (
            track_id INTEGER NOT NULL,
            album_id INTEGER NOT NULL,

            PRIMARY KEY (track_id, album_id),

            FOREIGN KEY (track_id) REFERENCES tracks(id),
            FOREIGN KEY (album_id) REFERENCES albums(id)
        );`
    )
    
    // TODO tracks_playlists : every playlist can be empty and a song may not be added to any playlist

    
    // artists_albums :
    await db.exec(
        `CREATE TABLE IF NOT EXISTS artists_albums (
            artist_id INTEGER NOT NULL,
            album_id INTEGER NOT NULL,

            PRIMARY KEY (artist_id, album_id),

            FOREIGN KEY (artist_id) REFERENCES artists(id),
            FOREIGN KEY (album_id) REFERENCES albums(id)
        );`
    )
    
    // tracks_genres : a track may not have a genre (unsufficient data), a genre may have been added related to a artist or album and may not have a single related track
    await db.exec(
        `CREATE TABLE IF NOT EXISTS tracks_genres (
            track_id INTEGER NOT NULL,
            genre_id INTEGER NOT NULL,

            PRIMARY KEY (track_id, genre_id),

            FOREIGN KEY (track_id) REFERENCES tracks(id),
            FOREIGN KEY (genre_id) REFERENCES genres(id)
        );`
    )
    
    // artists_genres : an artist may not have a genre (unsufficient data), a genre may have been added related to a track or album and may not have a single related artist
    await db.exec(
        `CREATE TABLE IF NOT EXISTS artists_genres (
            artist_id INTEGER NOT NULL,
            genre_id INTEGER NOT NULL,

            PRIMARY KEY (artist_id, genre_id),

            FOREIGN KEY (artist_id) REFERENCES artists(id),
            FOREIGN KEY (genre_id) REFERENCES genres(id)
        );`
    )

    // album_genres : an album may not have a genre (unsufficient data), a genre may have been added related to a track or artist and may not have a single related album
    await db.exec(
        `CREATE TABLE IF NOT EXISTS albums_genres (
            album_id INTEGER NOT NULL,
            genre_id INTEGER NOT NULL,

            PRIMARY KEY (album_id, genre_id),

            FOREIGN KEY (album_id) REFERENCES albums(id),
            FOREIGN KEY (genre_id) REFERENCES genres(id)
        );`
    )
    
}
setupDb();

// TABLES
async function addTrack(name, duration, track_artist, track_album) {
  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO tracks (name, favorited, duration, track_artist, track_album) 
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
      `INSERT OR IGNORE INTO artists (name, favorited, born, founded, country, wiki) 
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
      `INSERT OR IGNORE INTO albums (name, favorited, year, wiki, length) 
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
      `INSERT OR IGNORE INTO genres (name, wiki) 
       VALUES (?, ?);`,
      [name, wiki]
    );
    console.log(`genre "${name}" added with id : ${result.lastID}`);
  } catch (error) {
    console.error(`couldn't add track "${name}" :`, error);
  } 
}

// LINKS
async function addTrackArtist(trackName, artistName) {
  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO tracks_artists (track_id, artist_id) 
       VALUES (
         (SELECT id FROM tracks WHERE name = ?),
         (SELECT id FROM artists WHERE name = ?)
       );`,
      [trackName, artistName]
    );
    if (result.changes > 0) {
        console.log(`link between ${trackName} and artist ${artistName} added`);
    }
  } catch (error) {
    console.error(`couldn't add link between ${trackName} and artist with id ${artistName} :`, error);
  } 
}

async function addTrackAlbum(trackName, albumName) {
  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO tracks_albums (track_id, album_id) 
       VALUES (
         (SELECT id FROM tracks WHERE name = ?),
         (SELECT id FROM albums WHERE name = ?)
       );`,
      [trackName, albumName]
    );
    if (result.changes > 0) {
        console.log(`link between ${trackName} and album ${albumName} added`);
    }
  } catch (error) {
    console.error(`couldn't add link between ${trackName} and album with id ${albumName} :`, error);
  }
}

async function addArtistAlbum(artistName, albumName) {
  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO artists_albums (artist_id, album_id) 
       VALUES (
         (SELECT id FROM artists WHERE name = ?),
         (SELECT id FROM albums WHERE name = ?)
       );`,
      [artistName, albumName]
    );
    if (result.changes > 0) {
        console.log(`link between ${artistName} and album ${albumName} added`);
    }
  } catch (error) {
    console.error(`couldn't add link between ${artistName} and album with id ${albumName} :`, error);
  }
}

async function addTrackGenre(trackName, genreName) {
  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO tracks_genres (track_id, genre_id) 
       VALUES (
         (SELECT id FROM tracks WHERE name = ?),
         (SELECT id FROM genres WHERE name = ?)
       );`,
      [trackName, genreName]
    );
    if (result.changes > 0) {
        console.log(`link between ${trackName} and genre ${genreName} added`);
    }
  } catch (error) {
    console.error(`couldn't add link between ${trackName} and genre with id ${genreName} :`, error);
  } 
}

async function addArtistGenre(artistName, genreName) {
  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO artists_genres (artist_id, genre_id) 
       VALUES (
         (SELECT id FROM artists WHERE name = ?),
         (SELECT id FROM genres WHERE name = ?)
       );`,
      [artistName, genreName]
    );
    if (result.changes > 0) {
        console.log(`link between ${artistName} and genre ${genreName} added`);
    }
  } catch (error) {
    console.error(`couldn't add link between ${artistName} and genre with id ${genreName} :`, error);
  } 
}

async function addAlbumGenre(albumName, genreName) {
  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO albums_genres (album_id, genre_id) 
       VALUES (
         (SELECT id FROM albums WHERE name = ?),
         (SELECT id FROM genres WHERE name = ?)
       );`,
      [albumName, genreName]
    );
    if (result.changes > 0) {
        console.log(`link between ${albumName} and genre ${genreName} added`);
    }
  } catch (error) {
    console.error(`couldn't add link between ${albumName} and genre with id ${genreName} :`, error);
  } 
}

// --- TESTS ---
// await addTrack("aurora", 279, "björk", "vespertine")
// await addArtist("björk", null, "1965-11-21", "iceland", "björk's wiki")
// await addAlbum("vespertine", 2001, "verpertine's wiki", 3341)
// await addGenre("electronic", "electronic's wiki")

// await addTrack("man in the box", 286, "alice in chains", "facelift")
// await addArtist("alice in chains", 1987, null, "usa", "alice in chains's wiki")
// await addAlbum("facelift", 1990, null, 3251)
// await addGenre("grunge", "grunge's wiki")

// await addTrackArtist("man in the box", "alice in chains")
// await addTrackAlbum("man in the box", "facelift")
// await addArtistAlbum("alice in chains", "facelift")
// await addTrackGenre("man in the box", "grunge")
// await addArtistGenre("alice in chains", "grunge")
// await addAlbumGenre("facelift", "grunge")



async function scanMusicFiles(dir) {
    try {
        const artists = await fs.promises.readdir(dir, { withFileTypes: true });

        for (const artist of artists) {
            if (artist.isDirectory()) {
                try {
                    const artistName = artist.name; // the name of the folder : chosen by the user so that it doesn't depend on the files metadata
                    const artistPath = path.join(dir, artistName);
                    const albums = await fs.promises.readdir(artistPath, { withFileTypes: true });
    
                    for (const album of albums) {
                        if (album.isDirectory()) {
                            try {
                                const albumName = album.name; // same here...
                                const albumPath = path.join(artistPath, albumName);
                                const tracks = await fs.promises.readdir(albumPath, { withFileTypes: true });
        
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

                                                await addTrack(metadata.common.title, secondsToString(metadata.format.duration), metadata.common.albumartist || metadata.common.artist, metadata.common.album)
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