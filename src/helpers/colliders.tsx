export function distPoints(a: number, b: number, x: number, y: number) {
  const result: number = (a - x) * (a - x) + (b - y) * (b - y);
  return result;
}
export function checkAPoint(
  a: number,
  b: number,
  x: number,
  y: number,
  r: number
) {
  const distance: number = distPoints(a, b, x, y);
  const ra = r * r;
  if (distance < ra) {
    return true;
  }
  return false;
}

export function distanceBetweenTwoPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const a = x1 - x2;
  const b = y1 - y2;

  const c = Math.sqrt(a * a + b * b);
  return c;
}

export default checkAPoint;
