import path from "path";
import fs from "fs";
import crypto from "crypto";
import chalk from "chalk";
import { questionMask } from "../utils/mask.js";
import genPass from "../utils/generatePassword.js";
import encryptPassword from "../utils/encryptPassword.js";
import { VAULT_PATH } from "../utils/VaultPath.js";


export default async function add(parts, rl) {

  if (!fs.existsSync(VAULT_PATH)) {
    console.log("Vault not initizalized : Run init command first");
    return;
  }

  if (parts.length < 3) {
    console.log(`   ${chalk.red(`Usage:`)} add <service> <username>\n`);
    return;
  }

  const [, service, username] = parts; // first , means skip first element.

  const passGen = await rl.question(
    "Do you want to generate a strong password? "
  );

  let password = "pass";

  const answer = passGen.toLowerCase();
  if (answer === "yes") {
    const Passlength = await rl.question(
      "Enter Password Length(should be above 8): "
    );
    console.log(
      `${chalk.red(
        `Note:-> If length passed is less than 8 , 8 length password will be generated.`
      )}`
    );

    if (Number(Passlength) < 8) {
      password = genPass(8);
    }
    else {
      password = genPass(Passlength);
    }

  } else if (answer === "no") {
    password = await questionMask(rl, "Password: ");

    if (!password) {
      console.log("Password cannot be empty");
      return;
    }
  } else {
    console.log('Please answer "yes" or "no"');
    return;
  }

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

  //encrypting user's password :=>
  const { iv, data } = encryptPassword(password, MasterPass, salt);

  vault.entries.push({
    name: service,
    username,
    password: { iv, data }
  });

  fs.writeFileSync(VAULT_PATH, JSON.stringify(vault, null, 2));

  console.log(`added password for gmail for your username : ${username}`);
}
