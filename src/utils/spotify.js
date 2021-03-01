let accessToken;
let clientToken;
const name = '2Day4Life';
const redirectUri = 'http://localhost:3000';
const spotifyKey = process.env.REACT_APP_SPOTIFY_KEY;
let spotifySecret = process.env.REACT_APP_SPOTIFY_ID;

const Spotify = {
  async getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {
      let accessTokenMatch;
      let timeoutInMatch;
      let popup = window.open(
        `https://accounts.spotify.com/authorize?client_id=${spotifyKey}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`,
        'Login with Spotify',
        'width=600,height=600'
      );

      const timer = setInterval(() => {
        try {
          accessTokenMatch = popup.location.href.match(/access_token=([^&]*)/);
          timeoutInMatch = popup.location.href.match(/expires_in=([^&]*)/);
        } catch (err) {
          /*console.log(err)*/
        }
        if (accessTokenMatch && timeoutInMatch) {
          popup.close();
          clearInterval(timer);
          accessToken = accessTokenMatch[1];
          const expiresIn = Number(timeoutInMatch[1]);
          window.setTimeout(() => {
            this.getAccessToken();
            accessToken = '';
          }, expiresIn * 1000);
          return accessToken;
        }
      }, 1000);
    }
  },

  async getClientToken() {
    if (clientToken) {
      return clientToken;
    }
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          new Buffer.from(spotifyKey + ':' + spotifySecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const data = await response.json();
    clientToken = data.access_token;
    console.log(clientToken);
    window.setTimeout(() => (clientToken = ''), data.expires_in * 1000);
  },

  async findTrackData(id) {
    const clientId = await Spotify.getClientToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${clientId}` },
      });
      const data = await response.json();
      const spotifyData = {
        album: data.album.name,
        image: data.album.images[1].url,
        releaseDate: data.album.release_date,
        popularity: data.popularity,
        uri: data.uri,
        spotifyId: data.id,
        show: true,
      };
      return spotifyData;
    } catch (err) {
      /*console.log(err)*/
    }
  },
  async search(term) {
    try {
      const clientId = await Spotify.getClientToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${clientId}` },
        }
      );
      const data = await response.json();
      //console.log(data)
      return data;
    } catch (err) {
      /*console.log(err)*/
    }
  },
  async setUserId() {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + accessToken },
      });
      const data = await response.json();
      return data.id;
    } catch (err) {
      console.log(err);
    }
  },
  async createPlaylist(userId) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ name: name, public: true }),
        }
      );
      const data = await response.json();
      return data.id;
    } catch (err) {
      /*console.log(err)*/
    }
  },
  async checkPlaylist() {
    if (!accessToken) {
      Spotify.getAccessToken();
    }
    let playlistId;
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + accessToken },
      });
      const data = await response.json();
      const playlistArray = await data.items.map((item) => ({
        name: item.name,
        id: item.id,
      }));
      for (let i = 0; i < playlistArray.length; i++) {
        if (playlistArray[i].name === name) {
          playlistId = playlistArray[i].id;
        }
      }
      if (!playlistId) {
        const userId = await Spotify.setUserId();
        const id = await Spotify.createPlaylist(userId);
        playlistId = id;
      }
      return playlistId;
    } catch (err) {
      /*console.log(err)*/
    }
  },
  async addToPlaylist(playlistId, trackUri) {
    if (!(playlistId && trackUri)) {
      return;
    }
    try {
      const id = await Spotify.setUserId();
      const response = await fetch(
        `https://api.spotify.com/v1/users/${id}/playlists/${playlistId}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uris: [trackUri] }),
        }
      );
      const data = await response.json();
      return data;
    } catch (err) {
      /*console.log(err)*/
    }
  },
  async checkPlaylistTracks(id, trackId, trackUri) {
    if (!(id && trackId && trackUri)) {
      return;
    }
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${id}/tracks`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await response.json();
      const trackArray = await data.items.map((item) => ({
        id: item.track.id,
      }));
      for (let i = 0; i < trackArray.length; i++) {
        if (trackArray[i].id === trackId) {
          return {
            displayText: 'Song already in the playlist',
            success: false,
          };
        }
      }
      await Spotify.addToPlaylist(id, trackUri);
      return { displayText: 'Song added to Spotify', success: false };
    } catch (err) {
      /*console.log(err)*/
    }
  },
};
export default Spotify;
