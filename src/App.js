import { useState, useReducer, useEffect } from 'react';
import Listen from './components/listen/listen';
import Playlist from './components/playlist/playlist';
import Display from './components/display/display';
import Check from './components/check/check';
import InfoList from './components/infolist/infolist';
import Volume from './components/volume/volume';

import Audd from './utils/audd';
import TwoDay from './utils/twoday';
import Spotify from './utils/spotify';
import { useDimensionsSetter } from './utils/useDimensionSetter';
import './app.css';

const INITIAL_STATE = {
  artist: '',
  title: '',
  album: '',
  image: '',
  show: false,
  releaseDate: '',
  popularity: '',
  uri: '',
  spotifyId: false,
  displayText: '',
  success: false,
};

function reducer(state, action) {
  return { ...state, ...action.payload };
}

const setDetails = (obj) => ({
  payload: obj,
});

function App() {
  const [stream, setStream] = useState();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [check, setCheck] = useState('CHECK');
  const [width, height] = useDimensionsSetter();

  useEffect(() => {
    Spotify.getClientToken();
  }, []);

  const handleStream = (audioFeed) => {
    setStream(audioFeed);
  };

  const handleRecognise = async () => {
    setCheck('Checking');
    let spotifyResult;
    try {
      dispatch(setDetails({ ...INITIAL_STATE }));
      const blobData = await TwoDay.callBlob();
      if (!blobData) {
        setCheck('CHECK');
        dispatch(setDetails({ displayText: 'Oops, try again!' }));
        return;
      }
      const auddResult = await Audd.callingApi(blobData);
      if (auddResult.result === 'error') {
        reset();
        dispatch(setDetails({ displayText: 'Oops, try again!' }));
        return;
      }
      if (!auddResult.success) {
        reset();
        dispatch(setDetails({ displayText: "Sorry didn't catch that" }));
        return;
      }
      // remove brackets from song names and artists
      const title = auddResult.title.replace(/ *\([^)]*\) */g, '');
      const artist = auddResult.artist.replace(/ *\([^)]*\) */g, '');
      const searchData = await Spotify.search(`${title} ${artist}`);
      if (searchData.tracks.total === 0) {
        setCheck('CHECK');
        dispatch(setDetails({ displayText: "Couldn't ping Spotify" }));
        return;
      } else {
        spotifyResult = await Spotify.findTrackData(
          searchData.tracks.items[0].id
        );
      }
      setCheck('CHECK');
      dispatch(setDetails({ ...auddResult, ...spotifyResult }));
    } catch (error) {
      //console.log(error)
      reset();
    }
  };

  const handlePlayist = async () => {
    const id = await Spotify.checkPlaylist();
    const result = await Spotify.checkPlaylistTracks(
      id,
      state.spotifyId,
      state.uri
    );
    dispatch(setDetails({ ...state, ...result }));
  };

  const reset = () => {
    setCheck('CHECK');
    dispatch(setDetails({ ...INITIAL_STATE }));
  };

  return (
    <div
      className="app-container"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Volume audioElement={stream} />
      <Listen onAudioLoad={handleStream} />
      {stream && <Check check={check} onClick={handleRecognise} />}
      <InfoList show={state.show} displayData={state} />
      {state.success ? (
        <Playlist show={state.success} onClick={handlePlayist} />
      ) : (
        <Display displayData={state.displayText} />
      )}
    </div>
  );
}

export default App;
