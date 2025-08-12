import fetch from "node-fetch";

const user = "username";

// without this, i get an error 503 for too many requests...
const timeout = 1000;
// this represents a total time wasted of :
//    1 second per artist
//    2 seconds per album (1 for general data, one for tags)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchArtistData(artistName) {
  const url = `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artistName)}&limit=1&fmt=json`;

  await sleep(timeout);
 
  const response = await fetch(url, {
    headers: {
      "User-Agent": `radiance-server/alpha (${user})`
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error : ${response.status}`);
  }

  const data = await response.json();

  return data.artists?.[0] || null;
}

export async function fetchAlbumData(albumName, artistName) {
  const url = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(`release:${albumName} AND artist:${artistName}`)}&limit=1&fmt=json`;

  await sleep(timeout);

  const response = await fetch(url, {
    headers: {
      "User-Agent": `radiance-server/alpha (${user})`
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();

  return data.releases?.[0] || null;
}

export async function fetchAlbumTags(albumName, artistName) {
  const url = `https://musicbrainz.org/ws/2/release-group/?query=${encodeURIComponent(`releasegroup:${albumName} AND artist:${artistName}`)}&limit=1&fmt=json`;
  
  await sleep(timeout);
  
  const response = await fetch(url, {
    headers: {
      "User-Agent": `radiance-server/alpha (${user})`
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();

  return data['release-groups'][0].tags;
}

export function getTop5(tags) {
  if (tags) {
    return tags.sort((a,b) => b.count - a.count).slice(0, 5).map(tag => tag.name);
  }
  else {
    return null;
  }
}