
import './App.css'
import GameArea from './components/GameArea'

function App() {

  return (
    <>
      <GameArea width={500} height={700}>
        <h1>ゲームエリア</h1>
        <p>ここにゲームの内容が表示されます。</p>
      </GameArea>

    </>
  )
}

export default App
