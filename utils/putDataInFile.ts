import fs from "fs";

export default function putDataInFile(
  password: string,
  updateParams?: "newPassword" | "updatePasswordParams"
) {
  updateParams = updateParams ?? "newPassword";
  if (updateParams === "newPassword") {
    fs.writeFileSync(
      "passwords.json",
      JSON.stringify({
        password: password,
        date: new Date().toLocaleString(),
      }) + `\n`,
      { flag: "a" } // 'a' means appending to the file
    );
    return password;
  }
}
