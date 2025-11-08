import inquirer from "inquirer";
import chalk from "chalk";
import * as charset from "./utils/charset.ts";
import passwordGenerator from "./passwordGenerator.ts";
import { passwordEnropy } from "./utils/security.ts";

async function main() {
  console.clear();
  console.log(chalk.bold.cyanBright("\n🔒 PASSWORD GENERATOR CLI\n"));
  console.log(chalk.gray("Create strong, secure, and stylish passwords ✨"));
  console.log(chalk.gray("──────────────────────────────────────────────\n"));

  const answers: { length: number; charsets: string[][] } =
    await inquirer.prompt([
      {
        type: "number",
        name: "length",
        message: chalk.yellow("📏 Enter password length"),
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

  console.log(chalk.gray("\n──────────────────────────────────────────────"));

  const password: string = passwordGenerator(answers.length, answers.charsets);
  const entropy = passwordEnropy(answers.length, answers.charsets);

  console.log(chalk.greenBright.bold("\n🔐 Your password:"));
  console.log(chalk.cyanBright.bold(`\n   ${password}\n`));

  console.log(chalk.yellowBright.bold("📊 Entropy details:"));
  console.log(
    `${chalk.gray("  🔸 Alphabet size:")} ${chalk.white(
      entropy["Alphabet size"]
    )}`
  );
  console.log(
    `${chalk.gray("  🔹 Per character:")} ${chalk.white(
      entropy["Char Entropy"].toFixed(2)
    )} bits`
  );
  console.log(
    `${chalk.gray("  🔹 Full password:")} ${chalk.white(
      entropy["Full password entropy"].toFixed(2)
    )} bits`
  );

  console.log(chalk.gray("\n──────────────────────────────────────────────"));

  const response = await inquirer.prompt([
    {
      type: "confirm",
      name: "regenerate",
      message: chalk.magentaBright("🔁 Generate another password?"),
      default: false,
    },
  ]);

  if (response.regenerate) {
    console.log(chalk.gray("\nRefreshing...\n"));
    main();
  } else {
    console.log(
      chalk.greenBright.bold("\n✅ All done! Stay safe out there 💪\n")
    );
  }
}

main();
