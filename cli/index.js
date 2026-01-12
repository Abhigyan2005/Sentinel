import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import chalk from "chalk";
import init from "./commands/init.js";
import get from "./commands/get.js";
import add from "./commands/add.js";
import { render } from "./utils/render.js";
import open from "open";
import list from "./commands/list.js";

const rl = readline.createInterface({ input, output });

console.log(
  chalk.bgRed(`
██████╗  █████╗ ███████╗███████╗     ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗ 
██╔══██╗██╔══██╗██╔════╝██╔════╝    ██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗
██████╔╝███████║███████╗███████╗    ██║  ███╗██║   ██║███████║██████╔╝██║  ██║
██╔═══╝ ██╔══██║╚════██║╚════██║    ██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║
██║     ██║  ██║███████║███████║    ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝     ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 

`)
);

console.log("type help to get a list of commands\n");

async function main() {
  while (true) {
    const cmd = (await rl.question(">> ")).trim();
    const parts = cmd.split(" ");
    const command = parts[0];

    if (command === "exit") {
      break;
    }

    if (command === "help") {
      console.log(`
Commands:
  init    initialize vault
  add     add a password
  list    list entries
  get     get a password
  exit    quit
  clear   to clear the terminal window.

  Do you want to contribute or suggest features?
  type github
      `);
      continue;
    }

    if (command == "init") {
      await init(rl);
      continue;
    }

    if (command == "add") {
      await add(parts, rl);
      continue;
    }

    if (command == "get") {
      await get(parts, rl);
      continue;
    }


    if (command == "clear") {
      render();
      continue;
    }

    if (command === "github" || command === "repo") {
      await open("https://github.com/Abhigyan2005/PasswordManager");
      console.log("🌐 Opening GitHub repository...");
      continue;
    }

    if (command == "list") {
      await list(parts, rl);
      continue;
    }
    
    console.log("unknown command");
  }

  rl.close();
}

main();
