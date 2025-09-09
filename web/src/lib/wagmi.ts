import { http } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";


declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

// 仅使用通过 Webpack DefinePlugin 注入的全局变量（构建期替换）
const WC_PROJECT_ID = "demo-wc-project-id";
const SEPOLIA_RPC = "https://sepolia.infura.io/v3/a87057817bf74015ad1c2b1e20c3d2a8";
const MAINNET_RPC = "https://mainnet.infura.io/v3/a87057817bf74015ad1c2b1e20c3d2a8";

export const config = getDefaultConfig({
  appName: "RedPacket DApp",
  projectId: WC_PROJECT_ID,
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(SEPOLIA_RPC),
    [mainnet.id]: http(MAINNET_RPC),
  },
  ssr: false,
});
