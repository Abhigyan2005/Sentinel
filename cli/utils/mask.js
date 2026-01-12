import { stdin, stdout } from "process";

export async function questionMask(rl, prompt) {
  return new Promise((resolve) => {
    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
      rl.question(prompt).then(resolve);
      return;
    }

    let password = "";

    const originalListeners = stdin.listeners("data");

    stdin.removeAllListeners("data");

    stdout.write(prompt);

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const onData = (char) => {
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          stdin.setRawMode(false);
          stdin.removeListener("data", onData);
          stdout.write("\n");

          originalListeners.forEach((listener) => {
            stdin.on("data", listener);
          });

          resolve(password);
          break;

        case "\u0003":
          stdin.setRawMode(false);
          stdin.removeListener("data", onData);
          stdout.write("\n");
          process.exit();
          break;

        case "\u007F":
        case "\b":
          if (password.length > 0) {
            password = password.slice(0, -1);
            stdout.write("\b \b");
          }
          break;

        default:
          if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
            password += char;
            stdout.write("*");
          }
          break;
      }
    };

    stdin.on("data", onData);
  });
}
