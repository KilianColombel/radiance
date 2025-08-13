import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { fetchArtistData, fetchAlbumData, fetchAlbumTags, getTop5 } from './fetchData.js';
import { fetchArtistWiki, fetchAlbumWiki, fetchGenreWiki } from './fetchData.js';


export async function addTrack(name, duration, track_artist, track_album, disk_number, file_name) {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });

  try {
    await db.run(
      `INSERT OR IGNORE INTO tracks (name, favorited, duration, track_artist, track_album, disk_number, file_name) 
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [name, false, duration, track_artist, track_album, disk_number, file_name]
    );
  } catch (error) {
    console.error(`couldn't add track "${name}" :`, error);
  } finally {
    await db.close();
  }
}

export async function addArtist(artistName) {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });

  try {
    const existing = await db.get(
      `SELECT name FROM artists WHERE folder_name = ?`,
      [artistName]
    )

    if (!existing) {
      const artistData = await fetchArtistData(artistName);
      const artistWiki = await fetchArtistWiki(artistName);

      await db.run(
        `INSERT OR IGNORE INTO artists (name, folder_name, favorited, born, country, wiki, wiki_link) 
        VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [artistData.name, artistName, false, artistData['life-span'].begin, artistData.area.name, artistWiki.summary, artistWiki.page]
      )
      
      if(artistData.aliases) {
        for (let i = 0; i < artistData.aliases.length; i++) {
          await addAlias(artistData.aliases[i].name, artistName);
        }
      }
      const artistTags = getTop5(artistData.tags);
      if (artistTags) {
        for (let i = 0; i < artistTags.length; i++) {
          await addGenre(artistTags[i], null)
          await addArtistGenre(artistName, artistTags[i])
        }
      }
      return artistData.name;
    }
    else {
      const existing = await db.get(
        `SELECT name FROM artists WHERE folder_name = ?`,
        [artistName]
      )
      return existing.name;
    }
  } catch (error) {
    console.error(`couldn't add artist "${artistName}" :`, error);
  }finally {
    await db.close();
  }
}

export async function addAlbum(albumName, artistName, artistNameFromData, length, disk_count) {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });

  try {
    const existing = await db.get(
      `SELECT name FROM albums WHERE folder_name = ?`,
      [albumName]
    )
    if(!existing) {
      const albumData = await fetchAlbumData(albumName, artistNameFromData);
      const albumWiki = await fetchAlbumWiki(albumName, artistName);

      await db.run(
        `INSERT OR IGNORE INTO albums (name, folder_name, favorited, year, length, disk_count, wiki, wiki_link) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [albumData.title, albumName, false, albumData.date.split("-")[0], length, disk_count, albumWiki.summary, albumWiki.page]
      );

      const albumTags = await fetchAlbumTags(albumName, artistNameFromData).then(tags => getTop5(tags));
      if (albumTags) {
        for (let i = 0; i < albumTags.length; i++) {
          await addGenre(albumTags[i]);
          await addAlbumGenre(albumName, albumTags[i])
        }
      }

      return albumTags;
    }
  } catch (error) {
    console.error(`couldn't add album "${albumName}" :`, error);
  } finally {
    await db.close();
  }
}

async function addGenre(genreName) {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });

  try {
    const existing = await db.get(
      `SELECT * FROM genres WHERE name = ?`,
      [genreName]
    );
    
    if (!existing) {
      const wiki = await fetchGenreWiki(genreName);

      await db.run(
        `INSERT OR IGNORE INTO genres (name, wiki, wiki_link) 
         VALUES (?, ?, ?);`,
        [genreName, wiki.summary, wiki.page]
      );

    }
  } catch (error) {
    console.error(`couldn't add genre "${genreName}" :`, error);
  }finally {
    await db.close();
  }
}


export async function addTrackArtist(trackName, artistName) {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });

  console.log(trackName, artistName)

  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO tracks_artists (track_id, artist_id) 
       VALUES (
         (SELECT id FROM tracks WHERE name = ?),
         (SELECT id FROM artists WHERE folder_name = ?)
       );`,
      [trackName, artistName]
    );
  } catch (error) {
    console.error(`couldn't add link between ${trackName} and artist with id ${artistName} :`, error);
  } finally {
    await db.close();
  }
}


export async function addTrackAlbum(trackName, albumName) {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });

  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO tracks_albums (track_id, album_id) 
       VALUES (
         (SELECT id FROM tracks WHERE name = ?),
         (SELECT id FROM albums WHERE folder_name = ?)
       );`,
      [trackName, albumName]
    );
  } catch (error) {
    console.error(`couldn't add link between ${trackName} and album with id ${albumName} :`, error);
  }finally {
    await db.close();
  }
}


export async function addArtistAlbum(artistName, albumName) {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });

  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO artists_albums (artist_id, album_id) 
       VALUES (
         (SELECT id FROM artists WHERE folder_name = ?),
         (SELECT id FROM albums WHERE folder_name = ?)
       );`,
      [artistName, albumName]
    );
  } catch (error) {
    console.error(`couldn't add link between ${artistName} and album with id ${albumName} :`, error);
  }finally {
    await db.close();
  }
}

async function addTrackGenre(trackName, genreName) {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });

  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO tracks_genres (track_id, genre_id) 
       VALUES (
         (SELECT id FROM tracks WHERE name = ?),
         (SELECT id FROM genres WHERE name = ?)
       );`,
      [trackName, genreName]
    );
  } catch (error) {
    console.error(`couldn't add link between ${trackName} and genre with id ${genreName} :`, error);
  } finally {
    await db.close();
  }
}


async function addArtistGenre(artistName, genreName) {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });

  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO artists_genres (artist_id, genre_id) 
       VALUES (
         (SELECT id FROM artists WHERE name = ?),
         (SELECT id FROM genres WHERE name = ?)
       );`,
      [artistName, genreName]
    );
  } catch (error) {
    console.error(`couldn't add link between ${artistName} and genre with id ${genreName} :`, error);
  } finally {
    await db.close();
  }
}


async function addAlbumGenre(albumName, genreName) {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });

  try {
    const result = await db.run(
      `INSERT OR IGNORE INTO albums_genres (album_id, genre_id) 
       VALUES (
         (SELECT id FROM albums WHERE name = ?),
         (SELECT id FROM genres WHERE name = ?)
       );`,
      [albumName, genreName]
    );
  } catch (error) {
    console.error(`couldn't add link between ${albumName} and genre with id ${genreName} :`, error);
  } finally {
    await db.close();
  }
}

async function addAlias(alias, artistName) {
  const db = await open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });

  try {
    await db.run(
      `INSERT OR IGNORE INTO aliases (name, artist_name) 
       VALUES (?, ?);`,
      [alias, artistName]
    );
  } catch (err) {
    console.error(`couldn't add alias ${alias} for artist with id : ${artistName}`)
  }finally {
    await db.close();
  }
}