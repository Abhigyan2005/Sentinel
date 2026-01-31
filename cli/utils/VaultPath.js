import os from "os";
import path from "path";
import fs from "fs";

const DIR = path.join(os.homedir(), ".s3ntin3l");

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true });
}

export const VAULT_PATH = path.join(DIR, "vault.json");