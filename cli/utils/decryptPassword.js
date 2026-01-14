import crypto from "crypto";

export default function decryptPassword(encObj, masterPassword, salt) {
  const key = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, "sha256");

  const iv = Buffer.from(encObj.iv, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(encObj.data, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}