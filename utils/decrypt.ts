import crypto from "crypto";
import { ALGORITHM } from "./constants.ts";

export default function decrypt(data: string) {
  const enctyptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");
  const [ivHex, encrypted] = data.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, enctyptionKey, iv);
  const decrypted =
    decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  return decrypted;
}
