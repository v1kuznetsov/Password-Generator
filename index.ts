import inquirer from "inquirer";
import chalk from "chalk";
import * as charset from "./utils/charset.ts";
import createEncryptionKey from "./utils/createEncryptionKey.ts";
import passwordGenerator from "./utils/passwordGenerator.ts";
import { passwordStrength } from "./utils/security.ts";
import clipboard from "clipboardy";
import dotenv from "dotenv";
import fs from "fs";

if (!fs.existsSync(".env")) {
  createEncryptionKey();
}
if (!fs.existsSync("passwords.json")) {
  fs.writeFileSync("passwords.json", "");
}

dotenv.config();

import getDataFromFile from "./utils/getDataFromFile.ts";
import putDataInFile from "./utils/putDataInFile.ts";

const lineBefore = "──────────────────────────────────────────────\n";
const lineAfter = "\n──────────────────────────────────────────────";
const line = "\n──────────────────────────────────────────────\n";

async function main() {
  console.clear();
  console.log(chalk.bold.cyanBright("\n🔒 PASSWORD GENERATOR CLI"));
  console.log(chalk.gray("\nCreate strong, secure, and stylish passwords ✨"));
  console.log(chalk.gray(lineBefore));

  const menu = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: chalk.yellow("🔎 What do you want to do?"),
      choices: [
        { name: "🔐 Generate a password", value: "generate" },
        { name: "❓ Check my password", value: "check" },
        {
          name: "📔 Show generated passwords",
          value: "showGeneratedPasswords",
        },
        { name: "🚪 Exit", value: "exit" },
      ],
    },
  ]);

  if (menu.menu === "generate") {
    await generatePasswordMenu();
  } else if (menu.menu === "check") {
    await checkPasswordMenu();
  } else if (menu.menu === "showGeneratedPasswords") {
    await passwordsMenu();
  } else if (menu.menu === "exit") {
    exit();
  }
}

async function generatePasswordMenu() {
  const answers: { length: number; charsets: string[][] } =
    await inquirer.prompt([
      {
        type: "number",
        name: "length",
        message: chalk.yellow("📏 Enter password length:"),
        default: 16,
      },
      {
        type: "checkbox",
        name: "charsets",
        message: chalk.yellow("🧩 Choose which characters to include"),
        choices: [
          { name: "🔡 Lowercase (a-z)", value: charset.LOWERCASE },
          { name: "🔠 Uppercase (A-Z)", value: charset.UPPERCASE },
          { name: "🔢 Digits (0-9)", value: charset.DIGITS },
          { name: "💎 Symbols (!@#$%^...)", value: charset.SYMBOLS },
        ],
        default: [
          charset.LOWERCASE,
          charset.UPPERCASE,
          charset.DIGITS,
          charset.SYMBOLS,
        ],
      },
    ]);

  console.log(chalk.gray(lineAfter));

  const password: string = passwordGenerator(answers.length, answers.charsets);
  putDataInFile(password);

  console.log(chalk.greenBright.bold("\n🔐 Your password:"));
  console.log(chalk.cyanBright.bold(`\n${password}\n`));
  await checkPassword(password);

  console.log(chalk.gray(line));

  const response = await inquirer.prompt([
    {
      type: "list",
      name: "endGeneration",
      message: chalk.yellow("🔎 What do you want to do?"),
      choices: [
        { name: "🔙 Back to menu", value: "backToMenu" },
        { name: "🔄 Regenerate", value: "regenerate" },
        { name: "🚪 Exit", value: "exit" },
      ],
      default: false,
    },
  ]);

  if (response.endGeneration === "backToMenu") {
    main();
  } else if (response.endGeneration === "regenerate") {
    generatePasswordMenu();
  } else if (response.endGeneration === "exit") {
    exit();
  }
}

async function checkPasswordMenu() {
  const password: { password: string } = await inquirer.prompt([
    {
      type: "input",
      name: "password",
      message: chalk.yellow("🔐 Enter your password:"),
    },
  ]);
  await checkPassword(password.password);
  console.log(chalk.gray(line));

  const response = await inquirer.prompt([
    {
      type: "list",
      name: "endTest",
      message: chalk.yellow("🔎 What do you want to do?"),
      choices: [
        { name: "🔙 Back to menu", value: "backToMenu" },
        { name: "🔄 Try again", value: "tryAgain" },
        { name: "🚪 Exit", value: "exit" },
      ],
      default: false,
    },
  ]);

  if (response.endTest === "backToMenu") {
    main();
  } else if (response.endTest === "tryAgain") {
    checkPasswordMenu();
  } else if (response.endTest === "exit") {
    exit();
  }
}

async function passwordsMenu() {
  const options: { name: string; value: string }[] = [
    { name: "🔙 Back to menu", value: "backToMenu" },
  ];
  getDataFromFile().map((password) => {
    options.push({ name: password.password, value: password.password });
  });
  console.log(line);
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "generatedPasswords",
      message: "🧑🏻‍🚀 Choose password to show preferences:",
      choices: [...options],
      default: false,
    },
  ]);
  if (response.generatedPasswords === "backToMenu") {
    main();
  } else if (
    !(response.generatedPasswords === "backToMenu") &&
    typeof response.generatedPasswords === "string"
  ) {
    passwordPreferencesMenu(response.generatedPasswords);
  }
}

async function passwordPreferencesMenu(
  password: string,
  originalEntry?: true | false
) {
  originalEntry = originalEntry ?? true;
  const passwordData = getDataFromFile().find((passwordInFile) => {
    if (passwordInFile.password === password) return passwordInFile;
  })!;
  if (originalEntry === true) {
    console.log(`Password: ${passwordData.password}`);
    console.log(`Creating date: ${passwordData.date}`);
  }
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "passwordsPreferences",
      message: "🧑🏻‍🚀 What do you want to do?",
      choices: [
        { name: "🔙 Back to passwords menu", value: "backToPasswordsMenu" },
        {
          name: "📝 Copy password to clipboard",
          value: "copyPasswordToClipboard",
        },
      ],
      default: "copyPasswordToClipboard",
    },
  ]);
  if (response.passwordsPreferences === "backToPasswordsMenu") {
    passwordsMenu();
  } else if (response.passwordsPreferences === "copyPasswordToClipboard") {
    clipboard.writeSync(passwordData.password);
    console.log("\n✅ Password successfully copied to clipboard!\n");
    passwordPreferencesMenu(password, false);
  }
}

function exit() {
  return console.log(
    chalk.greenBright.bold("\n✅ All done! Stay safe out there 💪\n")
  );
}

async function checkPassword(password: string) {
  const result = passwordStrength(password);

  console.log("💪 Strength score (1-5):", result.score + 1);
  console.log(
    "📊 Estimated entropy (bits):",
    Number(Number(result.guesses_log10 * Math.LOG2E * 10).toFixed(2))
  );
  console.log("⏱️ Crack times:");
  console.log(
    " - Online:",
    result.crack_times_display.online_no_throttling_10_per_second
  );
  console.log(
    " - Offline (slow):",
    result.crack_times_display.offline_slow_hashing_1e4_per_second
  );
  console.log(
    " - Offline (fast):",
    result.crack_times_display.offline_fast_hashing_1e10_per_second
  );
  console.log(
    "💬 Feedback:",
    result.feedback.suggestions.join("; ") || "Looks good!"
  );
}

main();
