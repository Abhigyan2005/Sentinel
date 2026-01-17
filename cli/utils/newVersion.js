import { exec } from "child_process";
import { promisify } from "util";
import pkg from "../package.json" assert { type: "json" };

const execAsync = promisify(exec);

async function checkLatestVersion() {
  try {
    const { stdout } = await execAsync(`npm view ${pkg.name} version`);
    const latestVersion = stdout.trim();

    if (latestVersion !== pkg.version) {
      console.log(
        `\n⚠️  A new version (${latestVersion}) is available. Update with:\n` +
        `npm install -g ${pkg.name}\n`
      );
    }
  } catch (err) {

  }
}

export default checkLatestVersion;
