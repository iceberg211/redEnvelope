import { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const RedPacket = await ethers.getContractFactory("RedPacket");
  const red = await RedPacket.deploy();
  await red.waitForDeployment();

  const addr = await red.getAddress();
  console.log("RedPacket deployed to:", addr);

  // Attempt to write address to frontend addresses.ts
  try {
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const webAddrPath = path.resolve(__dirname, "../../web/src/features/redpacket/addresses.ts");
    let content = "export const addresses: Record<number, string> = {\n";
    if (fs.existsSync(webAddrPath)) {
      // naive replace for existing file
      const prev = fs.readFileSync(webAddrPath, "utf8");
      const replaced = prev.replace(/(\s*11155111:\s*")[^"]+("\s*,?)/, `$1${addr}$2`);
      if (replaced !== prev) {
        fs.writeFileSync(webAddrPath, replaced);
        console.log("Updated frontend addresses.ts");
        return;
      }
    }
    content += `  ${chainId}: "${addr}",\n`;
    content += "};\n";
    fs.writeFileSync(webAddrPath, content);
    console.log("Wrote new frontend addresses.ts");
  } catch (e) {
    console.log("Skip writing frontend address:", (e as Error).message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
