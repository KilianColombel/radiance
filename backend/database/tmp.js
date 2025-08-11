// TODO this is for testing only

import fetch from "node-fetch";

async function fetchReleaseGroupMBID(albumName, artistName) {
  const url = `https://musicbrainz.org/ws/2/release-group/?query=${encodeURIComponent(`releasegroup:${albumName} AND artist:${artistName}`)}&limit=1&fmt=json`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "radiance-server/alpha"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();

  if (data["release-groups"] && data["release-groups"].length > 0) {
    return data["release-groups"][0].id;
  }
  else {
    return null;
  }
}
async function fetchTagsForReleaseGroup(releaseGroupMBID) {
  if (!releaseGroupMBID) {
    return null;
  }
  const url = `https://musicbrainz.org/ws/2/release-group/${releaseGroupMBID}?inc=tags&fmt=json`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "radiance-server/alpha"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();

  return data.tags || null;
}
async function fetchAlbumTags(albumName, artistName) {
  try {
    const releaseGroupMBID = await fetchReleaseGroupMBID(albumName, artistName);
    if (releaseGroupMBID) {
      const tags = await fetchTagsForReleaseGroup(releaseGroupMBID);
      return tags;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// this works for albums, pretty messy though
// TODO i can't make it work with titles, i think i'll just stick with album tags...
fetchAlbumTags("paranoid", "black sabbath").then(tags => console.log(tags));
fetchAlbumTags("ninajirachi", "i love my computer").then(tags => console.log(tags));