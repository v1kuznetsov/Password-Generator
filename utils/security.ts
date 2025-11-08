export function passwordEnropy(passwordLength: number, alphabets: string[][]) {
  let alphabetSize = 0;
  for (const alphabet of alphabets) {
    alphabetSize += alphabet.length;
  }
  const charEntropy = Math.log2(alphabetSize);
  const fullEntropy = Math.log2(alphabetSize) * passwordLength;
  const result = {
    "Alphabet size": alphabetSize,
    "Char Entropy": Number(charEntropy.toFixed(2)),
    "Full password entropy": Number(fullEntropy.toFixed(2)),
  };

  return result;
}
