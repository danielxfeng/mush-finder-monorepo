/**
 * A TS implementation of the softmax function.
 * @see https://github.com/DanielJDufour/preciso/blob/main/softmax.js
 */
const softmax = (arr: number[]) => {
  arr = arr.map((n) => Math.exp(n));
  const total = arr.reduce((acc, val) => acc + val, 0);

  return arr.map((n) => n / total);
};

export { softmax };
