import zxcvbn from "zxcvbn";
import { timeFormatter } from "./timeFormatter.ts";

export function passwordEnropy(passwordLength: number, alphabets: string[][]) {
  let alphabetSize = 0;
  for (const alphabet of alphabets) {
    alphabetSize += alphabet.length;
  }
  const charEntropy = Math.log2(alphabetSize);
  const fullEntropy = Math.log2(alphabetSize) * passwordLength;
  const result = {
    alphabetSize,
    oneCharEntropy: Number(charEntropy.toFixed(2)),
    fullPasswordEntropy: Number(fullEntropy.toFixed(2)),
  };

  return result;
}

export function timeToCrack(entropy: number) {
  const guessesPerSecond = 1e9;
  const secondsToGuess = Math.pow(2, entropy) / 2 / guessesPerSecond;
  return {
    humanReadable: timeFormatter(secondsToGuess),
    isSecure: secondsToGuess > 1e11,
  };
}

export function passwordStrength(password: string) {
  const result = zxcvbn(password);
  return result;
}
