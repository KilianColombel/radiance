import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';

import { setupDb } from './createDatabase.js';
import { addTrack, addArtist, addAlbum, addTrackArtist, addTrackAlbum, addArtistAlbum } from './manageDatabase.js'
import { addUser, addPlaylist, addTrackToPlaylist, addUserToPlaylist, addTrackToFavorites, addArtistToFavorites, addAlbumToFavorites } from './manageDatabase.js'

const musicDirectory = '../../../music'; 
// the music directory should look like this :
// music_folder/
//   L artist_folder/
//     L album_folder/
//       L song1.*
//       L song2.*
//       ...
// this eliminates a lot of headaches when the files don't have the right metadata


const extensions = ["flac", "mp3", "aiff", "aac", "ape", "asf", "bwf", "dsdiff", "dsf", "mp2", "mka", "mkv", "mpc", "mp4", "m4a", "m4v", "ogg", "webm", "wv", "wma", "wav"] // i don't know most of these...
async function scanMusicFiles(dir) {
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

                for (const track of tracks) {
                  if (track.isFile()) {
                    const trackName = track.name;
                    const filePath = path.join(albumPath, trackName);
                    
                    if (extensions.includes(filePath.split(".").pop().toLocaleLowerCase())) { 
                      try {
                        const metadata = await parseFile(filePath, { duration: true });

                        albumDuration += metadata.format.duration;

                        await addTrack(metadata.common.title, Number.parseInt(metadata.format.duration), metadata.common.albumartist || metadata.common.artist, metadata.common.album, metadata.common.disk.no || 1, trackName)
                        // console.log("add tracks_artists : ", metadata.common.title, artistName)
                        await addTrackArtist(metadata.common.title, artistName);
                        // console.log("add tracks_albums : ", metadata.common.title, albumName)
                        await addTrackAlbum(metadata.common.title, albumName);

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


  } catch(err) {
      console.error("error in main folder", err);
  } 
}

scanMusicFiles(musicDirectory);