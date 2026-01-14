import crypto from "crypto";

export default function genPass(length) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allChars = lower + upper + numbers + symbols;

  let password = [ 
    lower[Math.floor(Math.random() * lower.length)],
    upper[Math.floor(Math.random() * upper.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  const remaining = Math.max(length - password.length, 0);

  const randomBytes = crypto.randomBytes(remaining);
  for (let i = 0; i < remaining; i++) {
    password.push(allChars[randomBytes[i] % allChars.length]);
  }

  for (let i = password.length - 1; i > 0; i--) {
    const j = crypto.randomBytes(1)[0] % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}
