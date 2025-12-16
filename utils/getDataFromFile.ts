import fs from "fs";
import decrypt from "./decrypt.ts";

export default function getDataFromFile() {
  const passwordsInFile: {
    serviceName: string;
    password: string;
    date: string;
  }[] = fs
    .readFileSync("passwords.json", "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((password) => {
      const passData = JSON.parse(password);
      return {
        serviceName: decrypt(passData.serviceName),
        password: decrypt(passData.password),
        date: decrypt(passData.date),
      };
    });
  return passwordsInFile;
}
