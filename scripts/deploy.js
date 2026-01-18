import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const DEPLOY_DIR = ".deploy";
const BUILD_DIR = "dist"; // use "build" if CRA

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

console.log("🚧 Building app...");
run("npm run build");

console.log("🧹 Cleaning deploy directory...");
fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
fs.mkdirSync(DEPLOY_DIR);

console.log("📂 Copying build files...");
fs.cpSync(BUILD_DIR, DEPLOY_DIR, { recursive: true });

console.log("📝 Committing & pushing...");
process.chdir(DEPLOY_DIR);
run("git add .");

try {
  run(`git commit -m "deploy: ${new Date().toISOString()}"`);
} catch {
  console.log("⚠️ Nothing to commit");
}

run("git push origin deployment");

console.log("✅ Deploy complete!");
