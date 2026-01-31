import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pkgPath = join(__dirname, "../../package.json");

const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function checkLatestVersion() {
  try {
    const { stdout } = await execAsync(`npm view ${pkg.name} version`);
    const latestVersion = stdout.trim();

    if (latestVersion !== pkg.version) {
      console.log(
        `\n⚠️  A new version (${latestVersion}) is available. Update with:\n` +
          `npm install -g ${pkg.name}\n`,
      );
    }
  } catch (err) {}
}

export default checkLatestVersion;
