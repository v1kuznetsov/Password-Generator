import fs from "fs";

export default function getDataFromFile() {
  const passwordsInFile: { password: string; date: string }[] = fs
    .readFileSync("passwords.json", "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((password) => {
      const passData = JSON.parse(password);
      return passData;
    });
  return passwordsInFile;
}
