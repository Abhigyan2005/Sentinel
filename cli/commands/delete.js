import chalk from "chalk";
import fs, { readFileSync, writeFileSync } from "fs";
import path from "path";
import crypto from "crypto";
import { render } from "../utils/render.js";
import { questionMask } from "../utils/mask.js";

export async function deleteEntry(rl, parts) {
  if (parts.length < 3) {
    console.log(`   ${chalk.red(`Usage:`)} delete <service> <username> \n`);
    return;
  }

  const VAULT_PATH = path.join(process.cwd(), "vault.json");

  if (!fs.existsSync(VAULT_PATH)) {
    console.log(chalk.red("❌ Vault not initialized : Run init command first"));
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

  const [, service, username] = parts;

  for (let i = 0; i < vault.entries.length; i++) {
    if (
      vault.entries[i].name == service &&
      vault.entries[i].username == username
    ) {
      vault.entries.splice(i, 1);
      fs.writeFileSync(VAULT_PATH, JSON.stringify(vault, null, 2));
      render();
      console.log(
        `${chalk.red(
          ` ⚠️ deleted your ${service} account with username ${username}`
        )}`
      );
      return;
    }
  }
}
