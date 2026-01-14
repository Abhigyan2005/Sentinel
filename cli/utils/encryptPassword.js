import crypto from "crypto";

export default function encryptPassword(plainPassword, masterPassword, salt) {
  const key = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, "sha256");

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(plainPassword, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    data: encrypted,
  };
}
