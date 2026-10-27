import { spawn } from "node:child_process";
import { loadDotenv, loadWranglerPublicVars } from "./env";

const [, , ...command] = process.argv;

if (command.length === 0) {
  console.error("Usage: tsx scripts/with-env.ts <command> [...args]");
  process.exit(1);
}

loadDotenv();
loadWranglerPublicVars();

const child = spawn(command[0], command.slice(1), {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32"
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
