const fs = require('fs');
const path = require('path');

function parseEnv(content) {
  const map = {};
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    map[key] = val;
  });
  return map;
}

function writeEnv(file, kv) {
  const lines = Object.entries(kv).map(([k, v]) => `${k}=${v.includes(' ') ? '"' + v + '"' : v}`);
  fs.writeFileSync(file, lines.join('\n') + '\n');
}

function main() {
  const root = process.cwd();
  const rootEnvPath = path.join(root, '.env');
  if (!fs.existsSync(rootEnvPath)) {
    console.error('No root .env found, skipped.');
    process.exit(0);
  }
  const envMap = parseEnv(fs.readFileSync(rootEnvPath, 'utf8'));

  // contracts/.env: RP_*
  const contractsEnv = {};
  for (const [k, v] of Object.entries(envMap)) {
    if (k.startsWith('RP_')) contractsEnv[k] = v;
  }
  const contractsDir = path.join(root, 'contracts');
  if (Object.keys(contractsEnv).length) {
    fs.mkdirSync(contractsDir, { recursive: true });
    writeEnv(path.join(contractsDir, '.env'), contractsEnv);
    console.log('Wrote contracts/.env');
  }

  // web/.env: VITE_*
  const webEnv = {};
  for (const [k, v] of Object.entries(envMap)) {
    if (k.startsWith('VITE_')) webEnv[k] = v;
  }
  const webDir = path.join(root, 'web');
  if (Object.keys(webEnv).length) {
    fs.mkdirSync(webDir, { recursive: true });
    writeEnv(path.join(webDir, '.env'), webEnv);
    console.log('Wrote web/.env');
  }
}

main();

