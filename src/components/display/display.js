import './display.css';

function Display({ displayData }) {
  return (
    <div className="displayDiv">
      <p className="display">{displayData}</p>
    </div>
  );
}

export default Display;
