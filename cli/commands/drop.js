import chalk from "chalk";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { render } from "../utils/render.js";
import { questionMask } from "../utils/mask.js";
import { VAULT_PATH } from "../utils/VaultPath.js";

export async function drop(rl) {

  if (!fs.existsSync(VAULT_PATH)) {
    console.log(chalk.red("❌ Vault not initialized : Run init command first"));
    return;
  }

  const confirm = await rl.question(
    "Are you sure you want to delete the vault ? (yes/no): "
  );

  if (confirm.toLowerCase() == "no" || confirm.toLowerCase() != "yes") {
    return;
  }

  const vault = JSON.parse(fs.readFileSync(VAULT_PATH, "utf-8"));
  const salt = vault.salt;

  for (let i = 3; i > 0; i--) {
    const a = await questionMask(rl, "Enter Master Password: ");
    const hash = crypto
      .pbkdf2Sync(a, salt, 100000, 32, "sha256")
      .toString("hex");

    if (vault.hash != hash) {
      let attempt_left = i - 1;
      console.log(
        chalk.red.bold(`❌  Wrong Password!  (${attempt_left} tries left)`)
      );
      if (attempt_left == 0) {
        return;
      }
      continue;
    } else {
      break;
    }
  }

  render();
  fs.unlink(VAULT_PATH, (err) => {
    if (err) {
      console.log("file couldnt be deleted");
    }

    console.log(`${chalk.red(` ⚠️ Vault has been deleted`)}`);
  });
}
