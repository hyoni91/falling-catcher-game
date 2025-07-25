
import {  useCallback, useRef, useState } from 'react';
import './App.css'
import GameArea from './components/GameArea'
import { useGameLoop } from './hooks/useGameLoop';
import Item from './components/Item';

// 定数の定義
const ITEM_SIZE = 20;
const SPAWN_INTERVAL = 1000; // ms 1秒ごとにアイテムを生成

function App() {

  const [items, setItems] = useState<{ id: number; x: number; y: number; speed: number }[]>([]);
  const nextId = useRef(0); 
  const spawnTimer = useRef(0); // アイテム生成のタイマー(next idを生成する間の時間)

  const update = useCallback((dt: number) => {
    spawnTimer.current += dt; // タイマーを更新
    if (spawnTimer.current >= SPAWN_INTERVAL) {
      spawnTimer.current = 0; // タイマーをリセット
      const newItem = {
        id: nextId.current++,
        x: Math.random() * 400, // 0から400の範囲でランダムなX座標
        y: 0, // Y座標は0からスタート
        speed: Math.random() * (5 - 2) + 2, //  px/frame (60fpsで120-360px/s) 
        //  Math.random() * (max – min) + min 난수를 생성하는 공식 

        size: ITEM_SIZE
      };
      setItems((prevItems) => [...prevItems, newItem]); // 新しいアイテムを追加
    }

    setItems(prev =>
      prev
        .map(item => ({
          ...item,
          y: item.y + item.speed * (dt / (1000 / 60)), // dtを使ってアイテムのY座標を更新
        }))
        // 4) 画面下に過ぎたら自動的に削除 (Miss処理と連動可能)
        .filter(item => item.y <= 600)
    );

  }, []);

  useGameLoop(update); // ゲームループを開始


  return (
    <>
      <GameArea width={500} height={700}>
        <h1>ゲームエリア</h1>
        {items.map(item => (
          <Item key={item.id} x={item.x} y={item.y} size={ITEM_SIZE} />
        ))}
      </GameArea>

    </>
  )
}

export default App
