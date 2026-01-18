import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * CONFIG
 */
const DEPLOY_BRANCH = "deployment";
const DEPLOY_DIR = ".deploy";
const BUILD_DIR = "dist"; // change to "build" if CRA

/**
 * Helpers
 */
function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit" });
}

function runSilent(command) {
  return execSync(command, { stdio: "pipe" }).toString().trim();
}

/**
 * 1️⃣ Ensure we're on main branch
 */
const currentBranch = runSilent("git branch --show-current");
if (currentBranch !== "main") {
  console.error(`❌ You must deploy from 'main'. Current branch: ${currentBranch}`);
  process.exit(1);
}

/**
 * 2️⃣ Ensure working tree is clean
 */
const status = runSilent("git status --porcelain");
if (status) {
  console.error("❌ Working tree is not clean. Commit or stash changes first.");
  process.exit(1);
}

/**
 * 3️⃣ Ensure worktree exists
 */
if (!fs.existsSync(DEPLOY_DIR)) {
  console.log("📁 Deploy worktree not found. Creating...");
  run(`git worktree add ${DEPLOY_DIR} ${DEPLOY_BRANCH}`);
}

/**
 * 4️⃣ Build app
 */
console.log("🚧 Building app...");
run("npm run build");

/**
 * 5️⃣ Validate build output
 */
if (!fs.existsSync(BUILD_DIR)) {
  console.error(`❌ Build directory '${BUILD_DIR}' not found.`);
  process.exit(1);
}

/**
 * 6️⃣ Clean deploy directory (but keep .git)
 */
console.log("🧹 Cleaning deploy directory...");
for (const file of fs.readdirSync(DEPLOY_DIR)) {
  if (file !== ".git") {
    fs.rmSync(path.join(DEPLOY_DIR, file), { recursive: true, force: true });
  }
}

/**
 * 7️⃣ Copy build output
 */
console.log("📂 Copying build files...");
fs.cpSync(BUILD_DIR, DEPLOY_DIR, { recursive: true });

/**
 * 8️⃣ Commit & push
 */
process.chdir(DEPLOY_DIR);

run("git add .");

try {
  run(`git commit -m "deploy: ${new Date().toISOString()}"`);
} catch {
  console.log("⚠️ No changes to commit");
}

run(`git push origin ${DEPLOY_BRANCH}`);

console.log("✅ Deploy completed successfully!");
