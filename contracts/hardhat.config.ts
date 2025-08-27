import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import * as path from "path";

// Prefer root .env, fallback to local
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const SEPOLIA_URL = process.env.RP_SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.RP_DEPLOYER_PRIVATE_KEY || "";
const ETHERSCAN_KEY = process.env.RP_ETHERSCAN_API_KEY || "";

const networks: HardhatUserConfig["networks"] = {};
if (SEPOLIA_URL) {
  let accounts: any = undefined;
  if (PRIVATE_KEY) {
    const val = PRIVATE_KEY.trim();
    accounts = val.startsWith('0x') ? [val] : { mnemonic: val };
  }
  networks!.sepolia = {
    url: SEPOLIA_URL,
    ...(accounts ? { accounts } : {}),
  } as any;
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "src",
  },
  networks,
  etherscan: {
    apiKey: ETHERSCAN_KEY || undefined,
  },
};

export default config;
