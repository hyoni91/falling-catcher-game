
import {  useState } from 'react';
import './App.css'
import GameArea from './components/GameArea'
import { useGameLoop } from './hooks/useGameLoop';

function App() {

  const [y, setY] = useState(0);

  useGameLoop((dt) => {
    setY(y => y + 100 * (dt/1000)); // dtを秒単位に変換してy座標を更新
  });

  return (
    <>
      <GameArea width={500} height={700}>
        <h1>ゲームエリア</h1>
        <div style={{ position: 'absolute', left: 0, top: y }}>
          <p>1</p>
        </div>
        <div style={{ position: 'absolute', left: 100, top: y-50 }}>
          <p>2</p>
        </div>
      </GameArea>

    </>
  )
}

export default App
