/**
 * Maps a number from one range to another.
 *
 * @param value - The number to map.
 * @param inRange - A tuple representing the input range [min, max].
 * @param outRange - A tuple representing the output range [min, max].
 * @returns The mapped number in the output range.
 *
 * @throws Will throw an error if the input range is zero.
 *
 * @example
 * ```ts
 * const result = mapRange(5, [0, 10], [0, 100]);
 * console.log(result); // 50
 * ```
 */
export function mapRange(
  value: number,
  inRange: [number, number],
  outRange: [number, number],
): number {
  const [inMin, inMax] = inRange;
  const [outMin, outMax] = outRange;

  if (inMax - inMin === 0) {
    throw new Error("Input range cannot be zero.");
  }

  const scaled = (value - inMin) / (inMax - inMin);
  return outMin + scaled * (outMax - outMin);
}
