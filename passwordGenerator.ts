import crypto from "crypto";

function genRandomChar(set: string[]) {
  const byte = crypto.randomBytes(1)[0];
  const index = byte % set.length;
  return set[index];
}

function cryptoRandomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0)
    throw new Error("'max' must be a positive integer");
  const RANGE = 2 ** 32;
  const threshold = Math.floor(RANGE / max) * max;
  while (true) {
    const rnd = crypto.randomBytes(4).readUInt32BE(0);
    if (rnd < threshold) return rnd % max;
  }
}

function shuffleInPlace<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = cryptoRandomInt(i + 1);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export default function passwordGenerator(length: number, groups: string[][]) {
  const charsPerGroup = Math.floor(length / groups.length);
  const remainder = length % groups.length;

  const result: string[] = [];

  for (const group of groups) {
    for (let i = 0; i < charsPerGroup; i++) {
      result.push(genRandomChar(group));
    }
  }

  for (let i = 0; i < remainder; i++) {
    const randomGroup = groups[crypto.randomBytes(1)[0] % groups.length];
    result.push(genRandomChar(randomGroup));
  }

  return shuffleInPlace(result).join("");
}
