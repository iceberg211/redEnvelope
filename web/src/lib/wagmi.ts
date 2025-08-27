import { http } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "RedPacket DApp",
  projectId: import.meta.env.VITE_RP_WC_PROJECT_ID || "demo-wc-project-id",
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_RP_SEPOLIA_RPC_URL),
    [mainnet.id]: http(import.meta.env.VITE_MAINNET_RPC_URL),
  },
  ssr: false,
});
