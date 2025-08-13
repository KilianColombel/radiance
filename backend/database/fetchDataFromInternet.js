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
    console.error(`could not fetch the artist data from musicbrainz ${response.status}`);
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
    console.error(`could not fetch the album data from musicbrainz ${response.status}`);
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
    console.error(`could not fetch the album tags from musicbrainz ${response.status}`);
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

async function searchWikipedia(query) {
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`,
    { headers: { 'User-Agent': `radiance-server/alpha (${user})` } }
  );
  if (!res.ok) {
    console.error(`couldn't fetch wikipedia search ${res.status}`);
  }
  return await res.json();
}

async function fetchWikipediaSummary(title) {
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { headers: { 'User-Agent': `radiance-server/alpha (${user})` } }
  );
  if (!res.ok) {
    console.error(`couldn't fetch wikipedia summary ${res.status}`);
  }
  return await res.json();
}

export async function fetchArtistWiki(artistName) {
  const searchQuery = `${artistName}`;
  const searchData = await searchWikipedia(searchQuery);

  if (searchData.query.search.length === 0) {
    console.error(`no wikipedia page found for artist "${artistName}"`);
  }

  const bestMatchTitle = searchData.query.search[0].title;
  const data = await fetchWikipediaSummary(bestMatchTitle);
  return {summary : data.extract, page : data['content_urls'].desktop.page, image: data.thumbnail?.source};
}

export async function fetchAlbumWiki(albumName, artistName) {
  const searchQuery = `${albumName} ${artistName} music album`;
  const searchData = await searchWikipedia(searchQuery);

  if (searchData.query.search.length === 0) {
    console.error(`no Wikipedia page found for "${albumName}" by "${artistName}"`);
  }

  const bestMatchTitle = searchData.query.search[0].title;
  const data = await fetchWikipediaSummary(bestMatchTitle);
  return {summary : data.extract, page : data['content_urls'].desktop.page};
}

export async function fetchGenreWiki(genreName) {
  const searchQuery = `${genreName} music`;
  const searchData = await searchWikipedia(searchQuery);

  if (searchData.query.search.length === 0) {
    console.error(`no wikipedia page found for "${genreName}" by "${artistName}"`);
  }

  const bestMatchTitle = searchData.query.search[0].title;
  const data = await fetchWikipediaSummary(bestMatchTitle);
  return {summary: data.extract, page: data['content_urls'].desktop.page};
}

// TODO very few results for this...
/* async function fetchWikipediaImage(title) {
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=600&origin=*`,
    { headers: { 'User-Agent': `radiance-server/alpha (${user})` } }
  );
  if (!res.ok) console.error(`HTTP ${res.status}`);
  const json = await res.json();

  const pages = json.query.pages;
  const page = pages[Object.keys(pages)[0]];
  return page.thumbnail?.source || null;
} */
