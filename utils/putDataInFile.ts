import fs from "fs";
import encrypt from "./encrypt.ts";

export default function putDataInFile(
  serviceName: string,
  password: string,
  updateParams?: "newPassword" | "updatePasswordParams"
) {
  updateParams = updateParams ?? "newPassword";
  if (updateParams === "newPassword") {
    const encryptedServiceName = encrypt(serviceName);
    const encryptedPassword = encrypt(password);
    const encryptedDate = encrypt(new Date().toLocaleString());
    fs.writeFileSync(
      "passwords.json",
      JSON.stringify({
        serviceName: encryptedServiceName,
        password: encryptedPassword,
        date: encryptedDate,
      }) + `\n`,
      { flag: "a" } // 'a' means appending to the file
    );
  }
}
