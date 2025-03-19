#!/usr/bin/env node

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from "fs";
import { execSync } from "child_process";

// Get CLI args
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error("Usage: npx ax4b-next-template <ProjectName>");
  process.exit(1);
}

const projectName = args[0];

// Get paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templateDir = join(__dirname, "../template");
const targetDir = join(process.cwd(), projectName);

// Check if target folder exists
if (existsSync(targetDir)) {
  console.error(`[ERRO]: Diretório "${projectName}" já existe.`);
  process.exit(1);
}

// Copy template to target directory
console.log(`Criando projeto ${projectName}`);
mkdirSync(targetDir);
cpSync(templateDir, targetDir, { recursive: true });

// Update package.json with new project name
const packageJsonPath = join(targetDir, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
packageJson.name = projectName;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log("Instalando dependências...");
execSync("npm install", { cwd: targetDir, stdio: "inherit" });

console.log("\n✅ Projeto criado com sucesso!");
console.log(`\Próximos passos:\n`);
console.log(`  cd ${projectName}`);
console.log(`  npm run dev\n`);

