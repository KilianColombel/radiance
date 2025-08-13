import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


async function createDB() {
    const filePath = "./radiance.db";
    try {
        if (fs.existsSync(filePath)) {
            console.log("database file already exists")
        }
        else {
            await fs.promises.writeFile(filePath, "", "utf8")
            console.log("database file has been created")
        }
    } catch (err) {
        console.log("error while creating database : ", err)
    }
}

export async function clearDatabase() {
    const db = await open({
        filename: './radiance.db',
        driver: sqlite3.Database
    });

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
export async function setupDb() {
    await createDB();

    const db = await open({
        filename: './radiance.db',
        driver: sqlite3.Database
    });
    
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
            disk_number INTEGER,
            file_name TEXT,
            UNIQUE(name, track_artist, track_album)
        );`
    );

    // artists table
    await db.exec(
        `CREATE TABLE IF NOT EXISTS artists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            folder_name,
            favorited BOOLEAN NOT NULL,
            born TEXT,
            country TEXT,
            wiki TEXT,
            wiki_link TEXT,
            UNIQUE(name)
        );`
    )

    // aliases table for better search (ex "Parannoul" == "파란노을" == "Huremic" == "Mydreamfever" == "lastar" == "끝이별" ...)
    // TODO maybe should do the same for albums if it's available on musicbrainz
    await db.exec(
       `CREATE TABLE IF NOT EXISTS aliases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            
            artist_name TEXT,
            FOREIGN KEY (artist_name) REFERENCES artist(name)

            UNIQUE(name, artist_name)
        );`
    )

    // albums table
    await db.exec(
        `CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            folder_name TEXT,
            favorited BOOLEAN NOT NULL,
            year INTEGER,
            length INTEGER,
            disk_count INTEGER,
            wiki TEXT,
            wiki_link TEXT,
            UNIQUE(name)
        );`
    )

    // genres table
    await db.exec(
        `CREATE TABLE IF NOT EXISTS genres (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            wiki TEXT,
            wiki_link TEXT,
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
    
    console.log("database tables generated");
}