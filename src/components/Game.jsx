import { useState } from 'react';
import Chessboard from './Chessboard';
import './Game.css';

export default function Game() {
  const [isWhiteNext, setIsWhiteNext] = useState(true)
  return (
    <>

      <div className="game">
      <Chessboard isWhiteNext={isWhiteNext} setIsWhiteNext={setIsWhiteNext}/>
      <div className='title'>
        <div className="players">
          <img src='./sources/white-player.png' className={isWhiteNext ? 'current-player' : ''} alt='white player'/>
          <img src='./sources/black-player.png' className={!isWhiteNext ? 'current-player' : ''} alt='black player'/>
        </div>

      </div>
      </div>
    </>

  );
}


