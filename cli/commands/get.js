import fs from "fs";
import path from "path";
import crypto from "crypto";
import chalk from "chalk";
import clipboard from 'clipboardy';
import { questionMask } from "../utils/mask.js";
import { render } from "../utils/render.js";
import decryptPassword from "../utils/decryptPassword.js";
import { VAULT_PATH } from "../utils/VaultPath.js";

export default async function get(parts, rl) {
  
  if (!fs.existsSync(VAULT_PATH)) {
    console.log("Vault not initizalized : Run init command first");
    return;
  }

  if (parts.length < 2) {
    console.log(`   ${chalk.red(`Usage:`)} get <service>\n`);
    return;
  }

  const [, service] = parts;

  const vault = JSON.parse(fs.readFileSync(VAULT_PATH, "utf-8"));

  const salt = vault.salt;

  let MasterPass = "";
  for (let i = 3; i > 0; i--) {
    MasterPass = await questionMask(rl, "Enter Master Password: ");
    const hash = crypto
      .pbkdf2Sync(MasterPass, salt, 100000, 32, "sha256")
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

  const result = vault.entries
    .filter((e) => e.name === service)
    .map((e) => {
      const password =  decryptPassword(e.password, MasterPass, salt);
      return {
        ...e,
        password
      };
    });

  if (result.length === 0) {
    console.log("No entry found");
    return;
  }

  render();

  console.log(chalk.bold.cyan(`\n🔐 Your Saved ${service} accounts\n`));
  let i = 1;
  for (const e of result) {
    console.log(`${i++}) ${chalk.green(e.username)}`);
  }

  let b = await rl.question("which account's password do you want ? respond with the index "); // always returns a string

  let index = Number(b) - 1;
  // console.log(result[index].password);
  render()
  await clipboard.write(result[index].password);
  console.log("password copied to your clipboard! ");
}
