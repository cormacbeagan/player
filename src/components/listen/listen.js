import { useState, useRef, useEffect } from 'react';
import TwoDay from '../../utils/twoday';
import './listen.css';

function Listen({ onAudioLoad }) {
  const [listen, setListen] = useState('LISTEN');
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);
  const btn = useRef();

  useEffect(() => {
    const audioSet = audio.current;
    const loader = () => {
      onAudioLoad(audioSet);
      TwoDay.creatingBlob(audio.current);
    };
    audioSet.addEventListener('playing', loader);
    return () => {
      audioSet.removeEventListener('playing', loader);
    };
  }, []);

  const handleKeyup = (e) => {
    if (e.keyCode === 32) {
      btn.current.click();
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleKeyup);
    return () => {
      document.removeEventListener('keyup', handleKeyup);
    };
  }, []);

  const playAudio = (e) => {
    if (playing) {
      audio.current.src = 'about';
      TwoDay.tearDown();
    } else {
      audio.current.src = 'https://radio2day.ip-streaming.net/radio2day';
      audio.current.volume = 0.3;
    }
    if (!playing) {
      audio.current.play();
    }
    setListen((prev) => (prev === 'LISTEN' ? 'STOP' : 'LISTEN'));
    setPlaying(() => !playing);
  };
  return (
    <div className="divListenStyle">
      <audio
        className="audioStyle"
        ref={audio}
        src=""
        type="audio/webm"
        crossOrigin="anonymous"
        id="audio"
      />
      <a
        href="/#"
        tabIndex="0"
        ref={btn}
        id="listen"
        className="listen-btn listen-btn-white"
        onClick={playAudio}
        style={
          listen === 'STOP'
            ? { backgroundColor: '#0e4aa531' }
            : { backgroundColor: '#f744447e' }
        }
      >
        {listen}
      </a>
    </div>
  );
}

export default Listen;
