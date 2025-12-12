import fs from "fs";
import encrypt from "./encrypt.ts";

export default function putDataInFile(
  password: string,
  updateParams?: "newPassword" | "updatePasswordParams"
) {
  updateParams = updateParams ?? "newPassword";
  if (updateParams === "newPassword") {
    const encryptedPassword = encrypt(password);
    const encryptedDate = encrypt(new Date().toLocaleString());
    fs.writeFileSync(
      "passwords.json",
      JSON.stringify({
        password: encryptedPassword,
        date: encryptedDate,
      }) + `\n`,
      { flag: "a" } // 'a' means appending to the file
    );
  }
}
