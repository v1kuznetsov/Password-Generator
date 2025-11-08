import zxcvbn from "zxcvbn";

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

function timeFormatter(secondsInput: number, maxUnits = 2): string {
  if (!isFinite(secondsInput) || secondsInput < 0) return "N/A";

  const secondsTotal = Math.floor(secondsInput);

  if (secondsTotal === 0) {
    return secondsInput > 0 ? "less than a second" : "0 seconds";
  }

  const SEC = 1;
  const MIN = 60 * SEC;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;

  let rem = secondsTotal;
  const parts: Array<{ value: number; unit: string }> = [];

  const units = [
    { seconds: YEAR, name: ["year", "years"] },
    { seconds: MONTH, name: ["month", "months"] },
    { seconds: WEEK, name: ["week", "weeks"] },
    { seconds: DAY, name: ["day", "days"] },
    { seconds: HOUR, name: ["hour", "hours"] },
    { seconds: MIN, name: ["minute", "minutes"] },
    { seconds: SEC, name: ["second", "seconds"] },
  ];

  for (const u of units) {
    if (rem >= u.seconds) {
      const v = Math.floor(rem / u.seconds);
      rem = rem - v * u.seconds;
      parts.push({ value: v, unit: pluralizeEn(v, u.name) });
    }
  }

  if (parts.length === 0 && secondsInput > 0 && secondsInput < 1) {
    return "less than a second";
  }

  const chosen = parts.slice(0, Math.max(1, maxUnits));

  if (chosen[0].unit === "year" || chosen[0].unit === "years") {
    return `${chosen[0].value}` + " " + `${chosen[0].unit}`;
  }

  return chosen.map((p) => `${p.value} ${p.unit}`).join(" ");
}

function pluralizeEn(n: number, forms: string[]): string {
  return n === 1 ? forms[0] : forms[1];
}
