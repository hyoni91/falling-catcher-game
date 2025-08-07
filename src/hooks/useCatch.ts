import { useCallback } from "react";
import type { Judgment } from "../types";

interface Item{
    id : number;
    y : number;
}

interface useCatchProps{
    items : Item[];
    itemSize : number; // アイテムのサイズ
    catchZoneY : number; // キャッチゾーンのY座標
    onHit: (id: number, scoreDelta: number, judgment: Judgment) => void; // アイテムがキャッチされたときのコールバック
    onMiss: (id: number, judgment: Judgment) => void; // アイテムがミスされたときのコールバック
}

export function useCatch({ items, itemSize, catchZoneY, onHit, onMiss }: useCatchProps) {

    return useCallback(() => {
       if (items.length === 0) return;
       const distances = items.map(item => {
          const itemBottom = item.y + itemSize; // itemSizeはアイテムのサイズを表す定数
          return {
            id: item.id,
            distance: Math.abs(itemBottom - catchZoneY),
          };
        })
        const nearest = distances.reduce((best, cur) =>
          cur.distance < best.distance ? cur : best
        , distances[0]);

        if(nearest.distance <= 10) {
          onHit(nearest.id, 100, 'Perfect'); 
        } else if (nearest.distance <= 20) {
          onHit(nearest.id, 50, 'Good'); 
        } else {
          onMiss(nearest.id, 'Miss');
        }
    }, [items, itemSize, catchZoneY, onHit, onMiss]);

}

