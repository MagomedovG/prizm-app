// Модуль для конечного поля
const P = 2n ** 255n - 19n;

// Константа для Curve25519
const _A = 486662n;

// Функция сложения точек
function pointAdd(pointN, pointM, pointDiff) {
  const [xn, zn] = pointN;
  const [xm, zm] = pointM;
  const [xDiff, zDiff] = pointDiff;

  const x = (4n * (xm * xn - zm * zn) ** 2n) % P;
  const z = (4n * (xm * zn - zm * xn) ** 2n) % P;

  return [x, z];
}

// Функция удвоения точки
function pointDouble(pointN) {
  const [xn, zn] = pointN;

  const xn2 = xn ** 2n;
  const zn2 = zn ** 2n;

  const x = (xn2 - zn2) ** 2n % P;
  const xzn = xn * zn;
  const z = (4n * xzn * (xn2 + _A * xzn + zn2)) % P;

  return [x, z];
}

// Константное время для обмена двух значений
function constTimeSwap(a, b, swap) {
  const index = swap ? 2 : 0;
  const temp = [a, b, b, a];
  return temp.slice(index, index + 2);
}

// Умножение точки на скаляр
function rawCurve25519(base, n) {
  const zero = [1n, 0n];
  const one = [base, 1n];
  let mP = zero, m1P = one;

  for (let i = 255; i >= 0; i--) {
    const bit = (n & (1n << BigInt(i))) !== 0n;
    [mP, m1P] = bit ? [pointDouble(m1P), pointAdd(mP, m1P, zero)] : [pointDouble(mP), pointAdd(m1P, mP, zero)];
  }

  return mP;
}

// Экспортируем функции
export default{
  P,
  _A,
  pointAdd,
  pointDouble,
  constTimeSwap,
  rawCurve25519
};
