import crypto from "crypto";
import fs from "fs";

export default function createEncryptionKey() {
  fs.writeFileSync(
    ".env",
    `ENCRYPTION_KEY=${crypto.randomBytes(32).toString("hex")}`
  );
}
