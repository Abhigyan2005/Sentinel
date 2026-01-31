import fs from "fs";
import crypto from "crypto";
import path from "path";
import { questionMask } from "../utils/mask.js";
import { VAULT_PATH } from "../utils/VaultPath.js";

export default async function init(rl) {
  if (fs.existsSync(VAULT_PATH)) {
    console.log("Vault Already Exists");
    console.log("Delete Vault.json to Reinitialize");
    return;
  }

  const password = await questionMask(rl, "Set master password: ");
  const confirm = await questionMask(rl, "Confirm master password: ");
  console.log("\n");

  if (password !== confirm) {
    console.log("❌ Passwords do not match\n");
    return;
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 32, "sha256")
    .toString("hex");

  const vault = { salt, hash, entries: [] };
  
  fs.writeFileSync(VAULT_PATH, JSON.stringify(vault, null, 2));
  console.log("✅ Vault initialized");
}
