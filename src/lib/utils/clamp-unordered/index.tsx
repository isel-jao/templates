/**
 * Clamps a number between two unordered values.
 *
 * @param value - The number to clamp.
 * @param a - One boundary of the range.
 * @param b - The other boundary of the range.
 * @returns The clamped number.
 *
 * @example
 * ```ts
 * const result = clampUnordered(15, 10, 0);
 * console.log(result); // 10
 * ```
 */
export function clampUnordered(value: number, a: number, b: number): number {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return Math.min(Math.max(value, min), max);
}
