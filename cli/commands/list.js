import fs from "fs";
import path from "path";
import chalk from "chalk";
import { render } from "../utils/render.js";

export default async function list() {
  const VAULT_PATH = path.join(process.cwd(), "vault.json");

  if (!fs.existsSync(VAULT_PATH)) {
    console.log(chalk.red("❌ Vault not initialized : Run init command first"));
    return;
  }

  const vault = JSON.parse(fs.readFileSync(VAULT_PATH, "utf-8"));

  const uniqueServices = new Set();

  for (const entries of vault.entries) { // for in gives index while for of gives the actual value!!
    uniqueServices.add(entries.name); 
  }

  const m = uniqueServices.size;

  if (m === 0) {
    console.log(chalk.yellow("⚠️ No entries found in the vault"));
    return;
  }

  render();
  console.log(chalk.bold.cyan(`\n🔐 Vault Services (${m}):\n`));

  const a = [...uniqueServices];
  for (let i = 0; i < m; i++) {
    console.log(
      `${chalk.yellow(i + 1)}. ${chalk.green.bold(a[i])}`
    );
    console.log(chalk.gray("──────────────────────────────\n"));
  }
}

