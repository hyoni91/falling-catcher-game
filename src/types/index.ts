export type Item = {
  id: number;
  x: number;         // 화면 왼쪽에서의 위치
  y: number;         // 화면 위쪽에서의 위치
  speed: number;     // px/frame
  size: number;      // 너비=높이
};

export type Judgment = 'Perfect' | 'Good' | 'Miss';