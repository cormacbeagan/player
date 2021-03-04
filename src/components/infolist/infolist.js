import { useEffect, useState } from 'react';
import Info from '../info/info';
import './infolist.css';
import Image from '../image/image';

function Infolist({ displayData }) {
  const side = 'right';
  const [date, setDate] = useState();

  useEffect(() => {
    const dateParts = displayData.releaseDate.split('-', 1);
    const year = dateParts[0];
    setDate(year);
  }, [displayData]);

  return (
    <div className="infoContainer">
      {displayData.show ? (
        <div className="outer" tabIndex="0">
          <div className="inner">
            <div className="imageStyle">{<Image data={displayData} />}</div>
            <div className="listStyle">
              <div className="divLeftStyle">
                <Info key={1} heading={'Track'} text={displayData.title} />
                <Info key={2} heading={'Artist'} text={displayData.artist} />
                <Info key={3} heading={'Released'} text={date} />
              </div>
              <div className="divRightStyle">
                <Info
                  key={4}
                  heading={'Album'}
                  text={displayData.album}
                  side={side}
                />
                <Info
                  key={5}
                  heading={'Popularity/100'}
                  text={displayData.popularity}
                  side={side}
                />
                <Info
                  key={6}
                  heading={'FM 89,0'}
                  text="radio2day"
                  side={side}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Image data={displayData} />
      )}
    </div>
  );
}

export default Infolist;
