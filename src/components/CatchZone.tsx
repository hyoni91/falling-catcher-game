

interface CatchZoneProps {
    y: number; // キャッチゾーンのY座標
    height: number; // キャッチゾーンの高さ
}

export default function CatchZone({ y, height}: CatchZoneProps) {

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: y, 
        width: '100%',
        backgroundColor: 'rgb(0, 255, 0)',
        borderTop: '2px solid green',
        height: `${height}px`,
        zIndex: 100, // 他の要素の上に表示 
      }}
    />
  );
}
