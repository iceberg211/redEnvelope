/// <reference types="node" />

interface ImportMetaEnv {
  // 前端可访问的环境变量需以 VITE_ 前缀开头
  readonly VITE_RP_WC_PROJECT_ID?: string;
  readonly VITE_RP_SEPOLIA_RPC_URL?: string;
  readonly VITE_MAINNET_RPC_URL?: string;
  // 允许其他扩展键
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

