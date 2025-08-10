import { promises as fs } from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';



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
                const artistName = artist.name;
                const artistPath = path.join(dir, artistName);
                const albums = await fs.readdir(artistPath, { withFileTypes: true });

                for (const album of albums) {
                    if (album.isDirectory()) {
                        const albumName = album.name;
                        const albumPath = path.join(artistPath, albumName);
                        const tracks = await fs.readdir(albumPath, { withFileTypes: true });

                        for (const track of tracks) {
                            if (track.isFile()) {
                                const filePath = path.join(albumPath, track.name);
                                const metadata = await parseFile(filePath, { duration: true });

                                console.log('---');
                                console.log(`title    : ${path.parse(track.name).name}`);
                                console.log(`artist   : ${artistName}`);
                                console.log(`album    : ${albumName}`);
                                console.log(`duration : ${secondsToString(metadata.format.duration)}`);
                            }
                        }
                    }
                }
            }
        }
    } catch (err) { // TODO maybe should divide this in other catches because right now, if one file fails, everything fails
        console.error("couldn' read file", err);
    }
}

// copied from frontend...
export function secondsToString(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

scanMusicFiles(musicDirectory);