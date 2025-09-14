# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在该仓库中工作时提供指导。

## 项目概述

部署在以太坊 Sepolia 测试网的去中心化红包 DApp。使用 pnpm monorepo 管理两个主要工作空间：智能合约和前端应用。

**合约地址**: `0x8f29Ea74667e3766D82698662d8FF170e148A1F6` (Sepolia)

## 架构设计

### Monorepo 结构
- `contracts/` - 使用 Hardhat 的 Solidity 智能合约
- `web/` - 使用 Vite + TypeScript 的 React 前端
- `scripts/` - 环境同步和 ABI 同步的工具脚本
- 根目录 package.json 管理工作空间命令

### 智能合约 (`contracts/`)
- **RedPacket.sol** - 主合约，包含创建/领取红包功能
- 使用伪随机分配（仅用于演示）
- 事件：`RedPacketCreated`、`RedPacketClaimed`、`RedPacketFinished`
- 使用 Hardhat 工具箱和 ethers.js 进行测试/部署

### 前端应用 (`web/`)
- **技术栈**: Webpack 5 + React + TypeScript + Mantine UI
- **构建工具**: Webpack 5 with SWC loader (替代 Vite)
- **Web3 集成**: wagmi v2 + viem + RainbowKit 钱包集成
- **测试框架**: Jest (单元测试) + Playwright (E2E 测试)
- **核心组件**:
  - `WalletBar.tsx` - 钱包连接和 ENS 显示
  - `SendPanel.tsx` - 创建红包
  - `ClaimPanel.tsx` - 领取红包
- **wagmi 配置**: 位于 `lib/wagmi.ts`
- **合约集成**: ABI 文件在 `features/redpacket/abi/RedPacket.json`，地址配置在 `features/redpacket/addresses.ts`
- **配置文件**:
  - `config/webpack/base.js` - Webpack 基础配置
  - `config/webpack/dev.js` - 开发环境配置
  - `config/webpack/prod.js` - 生产环境配置
  - `test/` - 测试文件目录
    - `test/unit/` - 单元测试
    - `test/e2e/` - E2E 测试
  - `.husky/` - Git hooks 配置
  - `.prettierrc` - Prettier 代码格式化配置

## 开发命令

### 安装与依赖
```bash
pnpm install:all          # 安装所有工作空间依赖
pnpm sync:env             # 同步根目录 .env 到各工作空间
```

### 合约开发
```bash
pnpm compile              # 仅编译合约
pnpm compile+abi          # 编译合约并同步 ABI 到前端
pnpm test:contracts       # 运行合约测试
pnpm deploy:sepolia       # 部署到 Sepolia（自动更新前端地址）
```

### 前端开发
```bash
pnpm dev:web              # 启动 Webpack 开发服务器
pnpm build:web            # 构建生产版本
pnpm build:web:analyze    # 构建并生成包分析报告
pnpm preview:web          # 预览生产构建
```

### 前端代码检查和类型检查
```bash
pnpm lint:web             # 运行 ESLint
pnpm lint:web:fix         # 运行 ESLint 并自动修复
pnpm type-check:web       # TypeScript 类型检查
```

### 前端测试
```bash
pnpm test:web             # 运行 Jest 单元测试
pnpm test:web:watch       # 监视模式运行测试
pnpm test:web:coverage    # 运行测试并生成覆盖率报告
pnpm test:e2e             # 运行 Playwright E2E 测试
pnpm test:e2e:ui          # 运行 E2E 测试（UI 模式）
pnpm test:e2e:debug       # 调试 E2E 测试
pnpm test:all             # 运行所有测试（合约+前端）
```

### 代码格式化
```bash
pnpm format:web           # 格式化前端代码
pnpm format:web:check     # 检查代码格式
```

### 清理命令
```bash
pnpm clean:web            # 清理前端构建产物
pnpm clean:all            # 清理所有构建产物
```

### AI 代码审查命令
```bash
pnpm ai-review            # 审查当前变更的文件
```

## 开发工具集成

### Git Hooks (Husky)
- **pre-commit**: 自动执行 lint fix、代码格式化和类型检查
- **pre-push**: 运行测试确保代码质量

### 代码质量工具
- **ESLint**: 代码静态检查，支持 React/TypeScript
- **Prettier**: 代码格式化，统一代码风格
- **TypeScript**: 类型检查，提升代码安全性
- **SWC**: 高性能 JavaScript/TypeScript 转译器

## 环境变量

根目录 `.env` 文件使用前缀来分离不同用途：
- `RP_*` - 合约/Hardhat 变量（如 `RP_SEPOLIA_RPC_URL`、`RP_DEPLOYER_PRIVATE_KEY`）
- `VITE_*` - 前端变量（如 `VITE_RP_SEPOLIA_RPC_URL`、`VITE_RP_WC_PROJECT_ID`）

使用 `pnpm sync:env` 自动将根目录环境变量分发到 `contracts/.env` 和 `web/.env`。

## 核心开发流程

### 合约修改流程
1. 修改 `contracts/src/RedPacket.sol` 中的合约
2. 运行 `pnpm compile+abi` 编译并同步 ABI
3. 运行 `pnpm test:contracts` 验证功能
4. 使用 `pnpm deploy:sepolia` 部署（自动更新前端地址）

### 前端开发流程
1. 前端自动使用合约编译后的最新 ABI
2. 合约地址配置在 `web/src/features/redpacket/addresses.ts`
3. wagmi 配置处理 Sepolia 网络和 RainbowKit 钱包集成

### 同步脚本
- `scripts/sync-abi.js` - 从合约复制编译后的 ABI 到前端
- `scripts/sync-env.js` - 将根目录 `.env` 分发到各工作空间 `.env` 文件
- 部署脚本自动更新前端合约地址

### AI 代码审查
- **工具脚本**: `scripts/simple-ai-review.js` - 调用 AI 接口进行代码审查
- **API 地址**: `https://weihe.life/aichat/graphql`
- **使用方式**: `pnpm ai-review` 手动触发审查
- **CI 集成**: GitHub Actions 在 PR 时自动运行

## 测试

合约测试使用 Hardhat 和 ethers.js。前端依赖在 Sepolia 测试网上的手动测试和钱包集成。

## 网络配置

主要针对 Sepolia 测试网（链ID: 11155111）。前端通过主网 RPC 支持 ENS 解析用于地址显示。