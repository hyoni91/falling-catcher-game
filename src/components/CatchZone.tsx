

interface CatchZoneProps {
    y: number; // キャッチゾーンのY座標
    height: number; // キャッチゾーンの高さ
}

export default function CatchZone({ y, height}: CatchZoneProps) {

  return (
    <div
      className="catch-zone"
      style={{
        top: y, 
        height: `${height}px`,
      }}
    >
      <span className="catch-zone-indicator">Catch Zone</span>
    </div>
  );
}
