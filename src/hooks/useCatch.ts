import { useCallback } from "react";

interface Item{
    id : number;
    y : number;
}

interface useCatchProps{
    items : Item[];
    itemSize : number; // アイテムのサイズ
    CatchZoneY : number; // キャッチゾーンのY座標
    onHit: (id: number, scoreDelta: number) => void; // アイテムがキャッチされたときのコールバック
    onMiss: (id: number) => void; // アイテムがミスされたときのコールバック
}

export function useCatch({ items, itemSize, CatchZoneY, onHit, onMiss }: useCatchProps) {

    return useCallback(() => {
       if (items.length === 0) return;
       const distances = items.map(item => {
          const itemBottom = item.y + itemSize; // itemSizeはアイテムのサイズを表す定数
          return {
            id: item.id,
            distance: Math.abs(itemBottom - CatchZoneY),
          };
        })
        const nearest = distances.reduce((best, cur) =>
          cur.distance < best.distance ? cur : best
        , distances[0]);

        if(nearest.distance <= 10) {
          onHit(nearest.id, 100); // Perfect
        } else if (nearest.distance <= 20) {
          onHit(nearest.id, 50); // Good
        } else {
          onMiss(nearest.id); // Miss
        }
    }, [items, itemSize, CatchZoneY, onHit, onMiss]);

}

