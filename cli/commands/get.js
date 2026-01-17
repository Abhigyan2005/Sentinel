import fs from "fs";
import path from "path";
import crypto from "crypto";
import chalk from "chalk";
import { questionMask } from "../utils/mask.js";
import { render } from "../utils/render.js";
import decryptPassword from "../utils/decryptPassword.js";

export default async function get(parts, rl) {
  const VAULT_PATH = path.join(process.cwd(), "vault.json");

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

  console.log(chalk.bold.cyan(`\n🔐 Your saved ${service} accounts\n`));

  for (const e of result) {
    console.log(chalk.magenta("──────────────────────────────"));
    console.log(`${chalk.bold.blue("Username:")} ${chalk.green(e.username)}`);
    console.log(`${chalk.bold.blue("Password:")} ${chalk.red(e.password)}`);
    console.log(chalk.magenta("──────────────────────────────\n"));
  }
}
