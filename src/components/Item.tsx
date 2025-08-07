
interface ItemProps {
  x: number; // アイテムのX座標
  y: number; // アイテムのY座標
  size: number; // アイテムのサイズ
}

export default function Item({ x, y, size }: ItemProps) {
  return (
    <div
      className="game-item star"      
      style={{ top: y, left: x, width: size, height: size }}
    />
    );
}

