import fs from "fs";
import path from "path";

export default async function list() {
  const VAULT_PATH = path.join(process.cwd(), "vault.json");

  if (!fs.existsSync(VAULT_PATH)) {
    console.log("Vault not initizalized : Run init command first");
    return;
  }

  const vault = JSON.parse(fs.readFileSync(VAULT_PATH, "utf-8"));

  const n = vault.entries.length;

  let a = [];
  for (let i = 0; i < n; i++) {
    if (a.includes(vault.entries[i].name)) {
      continue;
    } else {
      a.push(vault.entries[i].name);
    }
  }

  const m = a.length;
  for (let i = 0; i < m; i++) {
    console.log(a[i]);
  }
}
