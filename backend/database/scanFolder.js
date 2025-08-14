import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';

import { setupDb } from './createDatabase.js';
import { addTrack, addArtist, addAlbum, addTrackArtist, addTrackAlbum, addArtistAlbum } from './manageDatabase.js'
import { addUser, addPlaylist, addTrackToPlaylist, addUserToPlaylist, addTrackToFavorites, addArtistToFavorites, addAlbumToFavorites } from './manageDatabase.js'


const extensions = ["flac", "mp3", "aiff", "aac", "ape", "asf", "bwf", "dsdiff", "dsf", "mp2", "mka", "mkv", "mpc", "mp4", "m4a", "m4v", "ogg", "webm", "wv", "wma", "wav"] // i don't know most of these...
export async function scanMusicFiles(dir) {
  await setupDb();

  try {
    const artists = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const artist of artists) {
      if (artist.isDirectory()) {
        try {
          const artistName = artist.name;
          const artistPath = path.join(dir, artistName);
          const albums = await fs.promises.readdir(artistPath, { withFileTypes: true });

          console.log("***** ", artistName, " *****")
          const artistNameFromData = await addArtist(artistName)
          
          for (const album of albums) {
            if (album.isDirectory()) {
              try {
                const albumName = album.name;
                const albumPath = path.join(artistPath, albumName);
                const tracks = await fs.promises.readdir(albumPath, { withFileTypes: true });
                let albumDuration = 0;
                let diskCount = 1; 

                console.log(" =", albumName)

                const tracksList = []; // tracks to add to the linking table after the albums table has been generated
                
                for (const track of tracks) {
                  if (track.isFile()) {
                    const trackName = track.name;
                    const filePath = path.join(albumPath, trackName);

                    
                    if (extensions.includes(filePath.split(".").pop().toLocaleLowerCase())) { 
                      try {
                        const metadata = await parseFile(filePath, { duration: true });
                        
                        albumDuration += metadata.format.duration;
                        
                        tracksList.push(metadata.common.title);

                        await addTrack(metadata.common.title, Number.parseInt(metadata.format.duration), metadata.common.albumartist || metadata.common.artist, metadata.common.album, metadata.common.disk.no || 1, trackName)
                        await addTrackArtist(metadata.common.title, artistName);

                        diskCount = Math.max(diskCount, metadata.common.disk.of);

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

                await addAlbum(albumName, artistName, artistNameFromData, Number.parseInt(albumDuration), diskCount);
                await addArtistAlbum(artistName, albumName);

                for (let i = 0; i < tracksList.length; i++) {
                  await addTrackAlbum(tracksList[i], albumName);
                }

              } catch(err) {
                console.log("error in album folder", err);
              }
            }
          }
        } catch(err) {
            console.log("error in artist folder", err);
        }
      }
    }
    
    console.log("database generation succesful")

    await addUser("Kilian");
    await addPlaylist("test_playlist")
    await addTrackToPlaylist(1, 1);
    await addTrackToPlaylist(1, 2);
    await addTrackToPlaylist(1, 3);
    await addUserToPlaylist(1, 1);

    await addTrackToFavorites(1, 1);
    await addAlbumToFavorites(1, 1);
    await addArtistToFavorites(1, 1);
    await addTrackToFavorites(2, 1);
    await addAlbumToFavorites(2, 1);
    await addArtistToFavorites(2, 1);





  } catch(err) {
      console.error("error in main folder", err);
  } 
}
