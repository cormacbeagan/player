import { useEffect } from 'react';
import './playlist.css';

function Playlist({ onClick }) {
  // add track to spotify by pressing 'S'
  const handleKeyUp = (e) => {
    if (e.keyCode === 83) onClick();
  };

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  };

  return (
    <div className="divPlaylistStyle">
      <button className="playlist-btn" onClick={handleClick}>
        ADD TO PLAYLIST
      </button>
    </div>
  );
}

export default Playlist;
