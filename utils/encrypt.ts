import crypto from "crypto";
import { ALGORITHM } from "./constants.ts";

export default function encrypt(data: string) {
  const enctyptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, enctyptionKey, iv);
  const encrypted = cipher.update(data, "utf8", "hex") + cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}
