import React from "react";


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
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
        borderTop: '2px solid green',
        height: `${height}px`, 
      }}
    />
  );
}
