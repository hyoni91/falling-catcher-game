import { useCallback, useRef } from "react";
import type { ItemType } from "../types";

interface SpawnAndPhysicsState {
    spawnInterval: number;
    maxX: number;
    gameAreaHeight: number;
    itemSize: number;
    setItems: React.Dispatch<React.SetStateAction<ItemType[]>>; // アイテムの状態を更新する関数
    onMiss: (count: number) => void;
}

export function useSpawnAndPhysics({
    spawnInterval,
    maxX,
    gameAreaHeight,
    itemSize,
    setItems,
    onMiss,
    
}: SpawnAndPhysicsState) {
    const spawnTimer = useRef(0);
    const nextId = useRef(0);
    
    const update = useCallback((dt: number) => {
      spawnTimer.current += dt; 

      // spawnIntervalが経過したら新しいアイテムを生成
      if (spawnTimer.current >= spawnInterval) {
        spawnTimer.current = 0; 
        const newItem = {
          id: nextId.current++,
          x: Math.random() * maxX, 
          y: 20, 
          speed: Math.random() * (5 - 2) + 2, //  px/frame (60fpsで120-360px/s) 
          //  Math.random() * (max – min) + min 乱数を生成 

          size: itemSize
        };
        setItems((prevItems) => [...prevItems, newItem]); // 新しいアイテムを追加
      }
    }, [setItems, spawnInterval, maxX, itemSize]);

    
    const applyPhysics = useCallback((items: ItemType[], dt: number) => {
      let missed = 0;
      const nextItems = items
        .map(item => ({
          ...item,
          y: item.y + item.speed * (dt / (1000 / 60)),
          }))
          .filter(item => {
            if (item.y <= gameAreaHeight) {
              return true;  // アイテムがゲームエリア内にある場合は残す
            }
            // 底下に出たアイテムはMiss
            missed += 1;
            return false;   // 配列から削除
          });

        if (missed > 0) {
          onMiss(missed);
        }
        return nextItems;
    }, [gameAreaHeight, onMiss]);

     return { update, applyPhysics };
}

