// server.js - Hostinger Node.js Application Startup File
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverScript = path.join(__dirname, "server", "server.ts");

console.log("[Hostinger Node.js] Booting AuGust Aurea Corporate Website Server...");

// 1. Try launching via Node 18/20/22 module loader with tsx
const child = spawn(
  process.execPath,
  ["--import", "tsx", serverScript],
  {
    stdio: "inherit",
    env: { ...process.env },
  }
);

child.on("error", () => {
  console.log("[Hostinger Node.js] Falling back to npx tsx runner...");
  const fallback = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["tsx", serverScript],
    { stdio: "inherit", env: { ...process.env } }
  );
  fallback.on("exit", (code) => process.exit(code ?? 0));
});

child.on("exit", (code) => {
  if (code !== 0 && code !== null) {
    console.log(`[Hostinger Node.js] Process exited with code ${code}. Retrying with npx tsx...`);
    const fallback = spawn(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["tsx", serverScript],
      { stdio: "inherit", env: { ...process.env } }
    );
    fallback.on("exit", (fCode) => process.exit(fCode ?? 0));
  } else {
    process.exit(code ?? 0);
  }
});
