/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param value - The number to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped number.
 *
 * @example
 * ```ts
 * const result = clamp(15, 0, 10);
 * console.log(result); // 10
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
