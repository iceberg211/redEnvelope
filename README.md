# 链上抢红包 DApp

一个部署在以太坊 Sepolia 测试网的链上“抢红包”去中心化应用（DApp）。支持发红包、抢红包、事件提示、ENS 显示与钱包连接切换。项目采用 pnpm monorepo 管理合约与前端两部分，并提供一键同步环境变量与 ABI 的脚本。

**在线网络**

- 网络: Sepolia (chainId 11155111)
- RedPacket 合约地址: `0x8f29Ea74667e3766D82698662d8FF170e148A1F6`

## 功能特性

- 发红包：指定总金额与份数，上链生成红包。
- 抢红包：每个地址限抢一次；最后一个人领取所有剩余金额。
- 实时事件：前端订阅合约事件，提示“已发出/有人抢到/已抢完”。
- 钱包与 ENS：支持钱包连接/切换，显示地址与 ENS 名称。

## 技术栈

- 前端：Vite + React + TypeScript
- Web3：wagmi v2 + viem + RainbowKit（WalletConnect）
- UI：Mantine（含 Notifications）
- 合约：Solidity + Hardhat（ethers.js 用于测试/部署）
- 包管理：pnpm（monorepo）

## 目录结构

```
redEnvelope/
├─ contracts/                    # 合约与部署
│  ├─ src/RedPacket.sol
│  ├─ scripts/deploy.ts          # 部署到 Sepolia 并回填前端地址
│  ├─ test/RedPacket.test.ts
│  ├─ hardhat.config.ts
│  └─ .env.example
├─ web/                          # 前端（Vite + React）
│  ├─ src/
│  │  ├─ components/WalletBar.tsx
│  │  ├─ components/SendPanel.tsx
│  │  ├─ components/ClaimPanel.tsx
│  │  ├─ features/redpacket/abi/RedPacket.json
│  │  ├─ features/redpacket/addresses.ts
│  │  └─ lib/wagmi.ts
│  └─ .env.example
├─ scripts/
│  ├─ sync-env.js                # 根 .env → 子项目 .env 同步
│  └─ sync-abi.js                # 合约编译产物 ABI → 前端同步
├─ .env.example                  # 根环境变量样例（统一入口）
├─ package.json                  # 根脚本（pnpm workspace）
└─ pnpm-workspace.yaml
```

## 环境要求

- Node.js 18+（建议 20+）
- pnpm 8+（或 10+）

## 环境变量

在项目根目录复制 `.env.example` 为 `.env` 并填充：

- 合约/部署（Hardhat 使用 RP_*）
  - `RP_SEPOLIA_RPC_URL`：Sepolia 的 RPC URL（如 Infura/Alchemy）
  - `RP_DEPLOYER_PRIVATE_KEY`：部署者凭据，可填私钥（0x...）或助记词（12/24词）
  - `RP_ETHERSCAN_API_KEY`：可选，用于合约验证
- 前端（Vite 使用 VITE_*）
  - `VITE_RP_SEPOLIA_RPC_URL`：前端可用的 Sepolia RPC URL
  - `VITE_RP_WC_PROJECT_ID`：WalletConnect Project ID
  - `VITE_MAINNET_RPC_URL`：可选，用于解析 ENS（mainnet）

可用脚本 `pnpm sync:env` 将根 `.env` 拆分写入 `contracts/.env` 与 `web/.env`。

## 快速开始

1) 安装依赖

```
pnpm install:all
pnpm sync:env
```

2) 编译合约并同步 ABI 到前端

```
pnpm compile+abi
```

3) 部署到 Sepolia（自动回填前端地址）

```
pnpm deploy:sepolia
```

4) 启动前端

```
pnpm dev:web
```

打开浏览器连接钱包（选择 Sepolia），即可体验发/抢红包与事件提示。

## 常用脚本

- `pnpm install:all`：安装 monorepo 内所有依赖
- `pnpm sync:env`：根 `.env` → `contracts/.env` 与 `web/.env`
- `pnpm compile`：编译合约
- `pnpm compile+abi`：编译合约并同步 ABI 到前端
- `pnpm test:contracts`：运行合约测试
- `pnpm deploy:sepolia`：部署到 Sepolia 并回填 `web/src/features/redpacket/addresses.ts`
- `pnpm dev:web`：启动前端开发服务器
- `pnpm build:web`：构建前端产物

## 前端交互说明

- 顶部 `WalletBar`：钱包连接/切换，显示地址/ENS 名称。
- `SendPanel`：输入金额与份数 → 发红包；成功后会显示事件提示与红包 ID。
- `ClaimPanel`：输入红包 ID → 抢红包；重复抢会提示“你已经抢过了”，抢完提示“红包已抢完”。
- 事件订阅：通过 wagmi/viem 的 `watchContractEvent` 订阅合约事件，实时更新 UI。

## 合约说明

- 文件：`contracts/src/RedPacket.sol`
- 事件：`RedPacketCreated(address, uint256 amount, uint256 count)`、`RedPacketClaimed(address, uint256 amount)`、`RedPacketFinished(uint256 id)`
- 规则：
  - 每个地址仅可抢一次
  - 最后一个抢的人获得剩余全部金额
  - 伪随机数仅用于演示，不适合生产

## 注意事项与安全

- 随机性：合约中的随机分配使用了链上伪随机逻辑，仅适用于演示/测试，不可用于生产场景。
- 资金安全：请勿向测试合约存入大量资金；生产化需引入更安全的随机性与审计。
- 网络选择：前端需与钱包保持在同一网络（Sepolia）。
- 水龙头：测试前请自备 Sepolia ETH（Faucet）。

## 故障排查

- 连接错误/无法签名：确认 `VITE_RP_WC_PROJECT_ID` 配置正确，钱包网络为 Sepolia。
- 事件无法更新：确认 `VITE_RP_SEPOLIA_RPC_URL` 可访问，且合约地址已正确回填到 `addresses.ts`。
- No QueryClient set：我们已在根组件加入了 `QueryClientProvider`；若自行改动，请确保其包裹在 `RainbowKitProvider` 外层。
- 环境变量未生效：修改根 `.env` 后执行 `pnpm sync:env` 以同步到子项目。

## 许可

本项目代码仅用于学习与演示用途。

