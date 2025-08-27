const fs = require('fs');
const path = require('path');

function main() {
  const root = process.cwd();
  const artifact = path.join(root, 'contracts', 'artifacts', 'src', 'RedPacket.sol', 'RedPacket.json');
  const target = path.join(root, 'web', 'src', 'features', 'redpacket', 'abi', 'RedPacket.json');
  if (!fs.existsSync(artifact)) {
    console.error('Artifact not found:', artifact);
    process.exit(1);
  }
  const json = JSON.parse(fs.readFileSync(artifact, 'utf8'));
  const out = { abi: json.abi };
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(out, null, 2) + '\n');
  console.log('Synced ABI to', target);
}

main();

