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
    
    // users table : useless for now
    await db.exec(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            picture TEXT,
            is_admin BOOLEAN,
            can_edit BOOLEAN,
            UNIQUE(name)
        );`
    )

    // playlists table
    await db.exec(
        `CREATE TABLE IF NOT EXISTS playlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            thumbnail_path TEXT,
            UNIQUE(name)
        );`
    )

    // playlists_tracks : link between tracks and playlists
    await db.exec(
        `CREATE TABLE IF NOT EXISTS playlists_tracks (
            playlist_id INTEGER NOT NULL,
            track_id INTEGER NOT NULL,

            PRIMARY KEY (playlist_id, track_id),

            FOREIGN KEY (playlist_id) REFERENCES playlists(id),
            FOREIGN KEY (track_id) REFERENCES tracks(id)
        );`
    )

    // playlists_users : link between users and playlists
    await db.exec(
        `CREATE TABLE IF NOT EXISTS playlists_users (
            playlist_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,

            PRIMARY KEY (playlist_id, user_id),

            FOREIGN KEY (playlist_id) REFERENCES playlists(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`
    )

    // favorites
    await db.exec(
        `CREATE TABLE IF NOT EXISTS favorite_tracks (
            track_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            PRIMARY KEY (track_id, user_id),
            FOREIGN KEY (track_id) REFERENCES tracks(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`
    )
    await db.exec(
        `CREATE TABLE IF NOT EXISTS favorite_artists (
            artist_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            PRIMARY KEY (artist_id, user_id),
            FOREIGN KEY (artist_id) REFERENCES artists(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`
    )
    await db.exec(
        `CREATE TABLE IF NOT EXISTS favorite_albums (
            album_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            PRIMARY KEY (album_id, user_id),
            FOREIGN KEY (album_id) REFERENCES albums(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`
    )


    // --- LINKS BETWEEN TABLES --- 

    // tracks_artists : every track has an artist related to it (grandparent folder), but an artist folder can be empty
    await db.exec(
        `CREATE TABLE IF NOT EXISTS tracks_artists (
            track_id INTEGER NOT NULL,
            artist_id INTEGER NOT NULL,

            PRIMARY KEY (track_id, artist_id),

            FOREIGN KEY (track_id) REFERENCES tracks(id),
            FOREIGN KEY (artist_id) REFERENCES artists(id)
        );`
    )
    
    // tracks_albums : every track has an album related to it (parent folder), but an album folder can be empty
    await db.exec(
        `CREATE TABLE IF NOT EXISTS tracks_albums (
            track_id INTEGER NOT NULL,
            album_id INTEGER NOT NULL,

            PRIMARY KEY (track_id, album_id),

            FOREIGN KEY (track_id) REFERENCES tracks(id),
            FOREIGN KEY (album_id) REFERENCES albums(id)
        );`
    )

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

    await db.close();
    
    console.log("database tables generated");
}