import { useEffect } from 'react';
import './check.css';

function Check({ onClick, check }) {
  const handleKeyUp = (e) => {
    if (e.keyCode === 67) {
      onClick();
    }
  };
  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  };

  return (
    <div className="divCheckStyle">
      <button
        onClick={handleClick}
        className={`check-btn ${check === 'CHECK' ? ' ' : 'checking'}
        `}
      >
        {check}
      </button>
    </div>
  );
}

export default Check;
