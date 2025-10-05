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

- **前端**：Webpack 5 + React 19 + TypeScript
- **Web3**：wagmi v2 + viem + RainbowKit（WalletConnect）
- **UI**：Mantine v7（含 Notifications）
- **合约**：Solidity + Hardhat（ethers.js 用于测试/部署）
- **测试**：Jest（单元测试）+ Playwright（E2E 测试）
- **代码质量**：ESLint + Prettier + TypeScript + Husky
- **构建工具**：SWC（高性能编译器）
- **包管理**：pnpm（monorepo）
- **CI/CD**：GitHub Actions（自动测试 + AI 代码审查）

## 目录结构

```
redEnvelope/
├─ contracts/                    # 合约与部署
│  ├─ src/RedPacket.sol
│  ├─ scripts/deploy.ts          # 部署到 Sepolia 并回填前端地址
│  ├─ test/RedPacket.test.ts
│  ├─ hardhat.config.ts
│  └─ .env.example
├─ web/                          # 前端（Webpack 5 + React）
│  ├─ src/
│  │  ├─ components/             # UI 组件
│  │  │  ├─ WalletBar.tsx        # 钱包连接和 ENS 显示
│  │  │  ├─ SendPanel.tsx        # 发红包面板
│  │  │  └─ ClaimPanel.tsx       # 抢红包面板
│  │  ├─ features/redpacket/
│  │  │  ├─ abi/RedPacket.json   # 合约 ABI（自动同步）
│  │  │  └─ addresses.ts         # 合约地址配置
│  │  └─ lib/wagmi.ts            # wagmi 配置
│  ├─ config/webpack/            # Webpack 配置
│  │  ├─ base.js                 # 基础配置
│  │  ├─ dev.js                  # 开发环境配置
│  │  └─ prod.js                 # 生产环境配置
│  ├─ test/                      # 测试文件
│  │  ├─ unit/                   # Jest 单元测试
│  │  └─ e2e/                    # Playwright E2E 测试
│  └─ .env.example
├─ scripts/
│  ├─ sync-env.js                # 根 .env → 子项目 .env 同步
│  ├─ sync-abi.js                # 合约 ABI → 前端同步
│  └─ simple-ai-review.js        # AI 代码审查脚本
├─ .github/workflows/            # GitHub Actions CI/CD
│  ├─ tests.yml                  # 自动化测试
│  └─ ai-code-review.yml         # AI 代码审查
├─ .env.example                  # 根环境变量样例（统一入口）
├─ package.json                  # 根脚本（pnpm workspace）
└─ pnpm-workspace.yaml
```

## 环境要求

- Node.js 18+（建议 20+）
- pnpm 8+（或 10+）

## 环境变量

在项目根目录复制 `.env.example` 为 `.env` 并填充：

- 合约/部署（Hardhat 使用 `RP_*`）
  - `RP_SEPOLIA_RPC_URL`：Sepolia 的 RPC URL（如 Infura/Alchemy）
  - `RP_DEPLOYER_PRIVATE_KEY`：部署者凭据，可填私钥（0x...）或助记词（12/24 词）
  - `RP_ETHERSCAN_API_KEY`：可选，用于合约验证
- 前端（Webpack 使用 `VITE_*`）
  - `VITE_RP_SEPOLIA_RPC_URL`：前端可用的 Sepolia RPC URL
  - `VITE_RP_WC_PROJECT_ID`：WalletConnect Project ID
  - `VITE_MAINNET_RPC_URL`：可选，用于解析 ENS（mainnet）

可用脚本 `pnpm sync:env` 将根 `.env` 拆分写入 `contracts/.env` 与 `web/.env`。

## 快速开始

1. 安装依赖

```
pnpm install:all
pnpm sync:env
```

2. 编译合约并同步 ABI 到前端

```
pnpm compile+abi
```

3. 部署到 Sepolia（自动回填前端地址）

```
pnpm deploy:sepolia
```

4. 启动前端

```
pnpm dev:web
```

打开浏览器连接钱包（选择 Sepolia），即可体验发/抢红包与事件提示。

## 常用脚本

### 依赖管理

- `pnpm install:all`：安装 monorepo 内所有依赖
- `pnpm sync:env`：根 `.env` → `contracts/.env` 与 `web/.env`

### 合约开发

- `pnpm compile`：编译合约
- `pnpm compile+abi`：编译合约并同步 ABI 到前端
- `pnpm test:contracts`：运行合约测试
- `pnpm deploy:sepolia`：部署到 Sepolia 并自动更新前端地址

### 前端开发

- `pnpm dev:web`：启动 Webpack 开发服务器
- `pnpm build:web`：构建生产版本
- `pnpm build:web:analyze`：构建并生成包分析报告
- `pnpm preview:web`：预览生产构建

### 代码质量

- `pnpm lint:web`：运行 ESLint 检查
- `pnpm lint:web:fix`：自动修复 ESLint 问题
- `pnpm type-check:web`：TypeScript 类型检查
- `pnpm format:web`：格式化代码
- `pnpm format:web:check`：检查代码格式

### 测试

- `pnpm test:web`：运行 Jest 单元测试
- `pnpm test:web:watch`：监视模式运行测试
- `pnpm test:web:coverage`：生成测试覆盖率报告
- `pnpm test:e2e`：运行 Playwright E2E 测试
- `pnpm test:e2e:ui`：运行 E2E 测试（UI 模式）
- `pnpm test:e2e:debug`：调试 E2E 测试
- `pnpm test:all`：运行所有测试（合约 + 前端）

### 工具

- `pnpm ai-review`：运行 AI 代码审查
- `pnpm clean:web`：清理前端构建产物
- `pnpm clean:all`：清理所有构建产物

## 前端交互说明

- 顶部 `WalletBar`：钱包连接/切换，显示地址/ENS 名称。
- `SendPanel`：输入金额与份数 → 发红包；成功后会显示事件提示与红包 ID。
- `ClaimPanel`：输入红包 ID → 抢红包；重复抢会提示“你已经抢过了”，抢完提示“红包已抢完”。
- 事件订阅：通过 wagmi/viem 的 `watchContractEvent` 订阅合约事件，实时更新 UI。

## 核心实现要点

### 智能合约架构

**文件位置**：`contracts/src/RedPacket.sol`

**核心数据结构**：

```solidity
struct Packet {
    address sender;              // 发红包者
    uint256 total;               // 红包总金额
    uint256 remaining;           // 剩余金额
    uint256 remainingCount;      // 剩余份数
    bool finished;               // 是否已抢完
    mapping(address => bool) claimed;  // 领取记录
}
```

**关键功能实现**：

1. **红包创建** (`createRedPacket`)

   - 接收 ETH 并指定份数
   - 自动递增红包 ID
   - 验证金额至少为份数（每份至少 1 wei）
   - 触发 `RedPacketCreated` 事件

2. **红包领取** (`claimRedPacket`)

   - **防重入保护**：使用自定义 `nonReentrant` modifier
   - **随机金额算法**：
     - 最后一人领取全部剩余金额
     - 其他人领取随机金额（基于 `block.timestamp`、`block.prevrandao`）
     - 保证剩余人数至少每人 1 wei
   - **CEI 模式**：Checks → Effects → Interactions，防止重入攻击
   - 触发 `RedPacketClaimed` 和可能的 `RedPacketFinished` 事件

3. **状态查询**
   - `getPacket()`：获取红包详情
   - `hasClaimed()`：检查地址是否已领取

**安全考虑**：

- ✅ 重入保护（自定义 modifier）
- ✅ CEI 模式（先修改状态，后转账）
- ⚠️ 伪随机数仅供演示（生产环境需使用 Chainlink VRF）
- ✅ 防止领取金额为 0

### 前端架构

**Web3 集成层** (`web/src/lib/wagmi.ts`)：

- 使用 RainbowKit 的 `getDefaultConfig` 简化配置
- 支持 Sepolia（交易）+ Mainnet（ENS 解析）双链
- 配置自定义 RPC 端点以提升稳定性

**组件设计**：

1. **WalletBar.tsx** - 钱包连接栏

   - RainbowKit 的 `ConnectButton` 组件
   - ENS 名称自动解析和显示
   - 钱包切换和断开连接

2. **SendPanel.tsx** - 发红包面板

   - 使用 wagmi 的 `useWriteContract` hook
   - 表单验证（金额、份数）
   - 交易状态追踪（等待确认、成功、失败）
   - 成功后显示红包 ID

3. **ClaimPanel.tsx** - 抢红包面板
   - 先查询红包状态（`useReadContract`）
   - 检查是否已领取（`hasClaimed`）
   - 调用领取合约（`useWriteContract`）
   - 显示领取金额和剩余状态

**事件监听机制**：

- 使用 wagmi 的 `watchContractEvent` 监听合约事件
- 实时捕获 `RedPacketCreated`、`RedPacketClaimed`、`RedPacketFinished`
- 通过 Mantine Notifications 显示事件通知

### Webpack 构建优化

**配置文件结构** (`web/config/webpack/`)：

- **base.js**：基础配置（entry、output、resolve、plugins）
- **dev.js**：开发环境（HMR、source-map、dev-server）
- **prod.js**：生产环境（压缩、优化、bundle 分析）

**关键优化**：

1. **SWC 编译器**：替代 Babel，提升编译速度 5-10 倍
2. **代码分割**：
   - Vendor 分离（React、wagmi、viem 等）
   - 动态导入支持
3. **压缩优化**：
   - TerserPlugin（JS 压缩）
   - CssMinimizerPlugin（CSS 压缩）
   - CompressionPlugin（Gzip 压缩）
4. **Node polyfills**：为 Web3 库提供浏览器兼容性（crypto、buffer、stream 等）
5. **热更新**：React Refresh Webpack Plugin

### 测试策略

**合约测试** (`contracts/test/`)：

- Hardhat + ethers.js
- 测试场景：
  - 创建红包
  - 单人/多人领取
  - 防重复领取
  - 边界情况（金额为 0、份数为 0）

**前端单元测试** (`web/test/unit/`)：

- Jest + React Testing Library
- 组件渲染测试
- 用户交互测试
- Mock Web3 hooks

**E2E 测试** (`web/test/e2e/`)：

- Playwright
- 测试完整用户流程：
  - 钱包连接
  - 发红包流程
  - 抢红包流程
  - 错误处理

## 注意事项与安全

- 随机性：合约中的随机分配使用了链上伪随机逻辑，仅适用于演示/测试，不可用于生产场景。
- 资金安全：请勿向测试合约存入大量资金；生产化需引入更安全的随机性与审计。
- 网络选择：前端需与钱包保持在同一网络（Sepolia）。
- 水龙头：测试前请自备 Sepolia ETH（Faucet）。

## 开发工具集成

### Monorepo 工作流

**环境变量同步** (`scripts/sync-env.js`)：

- 从根目录 `.env` 读取配置
- 根据前缀自动分发到对应工作空间：
  - `RP_*` → `contracts/.env`
  - `VITE_*` → `web/.env`
- 避免重复维护多个环境文件

**ABI 自动同步** (`scripts/sync-abi.js`)：

- 监听合约编译输出 `contracts/artifacts/src/RedPacket.sol/RedPacket.json`
- 自动复制 ABI 到 `web/src/features/redpacket/abi/RedPacket.json`
- 确保前端始终使用最新合约接口

**部署脚本** (`contracts/scripts/deploy.ts`)：

- 部署合约到 Sepolia
- 自动更新 `web/src/features/redpacket/addresses.ts` 中的合约地址
- 验证合约（可选）

### Git Hooks（Husky）

**pre-commit** (`.husky/pre-commit`)：

```bash
pnpm lint:web:fix      # 自动修复 ESLint 问题
pnpm format:web        # 格式化代码
pnpm type-check:web    # TypeScript 类型检查
```

**pre-push** (`.husky/pre-push`)：

```bash
pnpm test:all          # 运行所有测试（合约 + 前端）
```

确保每次提交代码质量，防止破坏性变更进入远程仓库。

### CI/CD 工作流

**1. tests.yml** - 自动化测试流水线

```yaml
触发条件: PR / Push
执行步骤:
  - 安装依赖 (pnpm install:all)
  - 同步环境变量 (pnpm sync:env)
  - 编译合约 (pnpm compile)
  - 运行合约测试 (pnpm test:contracts)
  - 构建前端 (pnpm build:web)
  - 运行单元测试 (pnpm test:web)
  - 安装 Playwright (pnpm test:e2e:install)
  - 运行 E2E 测试 (pnpm test:e2e)
  - 上传测试报告
```

**2. ai-code-review.yml** - AI 代码审查

```yaml
触发条件: PR / Push / 手动触发
AI 模型: DeepSeek Chat (可切换为 DeepSeek Reasoner)
审查内容:
  - 代码质量和最佳实践
  - 潜在的安全问题
  - 性能优化建议
  - 代码风格一致性
```

### 开发辅助脚本

**AI 代码审查** (`scripts/simple-ai-review.js`)：

- 检测 Git 变更文件
- 调用 DeepSeek AI API 分析代码
- 支持本地运行：`pnpm ai-review`
- 集成到 CI/CD 自动触发

## 故障排查

- **连接错误/无法签名**：确认 `VITE_RP_WC_PROJECT_ID` 配置正确，钱包网络为 Sepolia
- **事件无法更新**：确认 `VITE_RP_SEPOLIA_RPC_URL` 可访问，且合约地址已正确回填到 `addresses.ts`
- **No QueryClient set**：确保 `QueryClientProvider` 包裹在 `RainbowKitProvider` 外层
- **环境变量未生效**：修改根 `.env` 后执行 `pnpm sync:env` 以同步到子项目
- **Webpack 构建错误**：检查 `web/config/webpack/` 下的配置文件
- **E2E 测试失败**：确保已安装 Playwright 浏览器：`pnpm test:e2e:install`

## 技术亮点与最佳实践

### 智能合约安全

- ✅ **重入保护**：自定义 `nonReentrant` modifier 防止重入攻击
- ✅ **CEI 模式**：严格遵循 Checks-Effects-Interactions 模式
- ✅ **数据完整性**：使用 mapping 记录领取状态，防止重复领取
- ✅ **金额验证**：确保每份红包至少 1 wei，避免除零或溢出
- ⚠️ **随机性声明**：明确标注伪随机数仅供演示，生产需使用 VRF

### 前端工程化

- ✅ **Monorepo 架构**：pnpm workspace 统一管理，依赖共享优化
- ✅ **类型安全**：TypeScript 全覆盖，编译期错误检测
- ✅ **自动化同步**：ABI 和环境变量自动同步，减少人工错误
- ✅ **热更新（HMR）**：Webpack + React Refresh，极速开发体验
- ✅ **代码分割**：Vendor chunk 分离，优化加载性能
- ✅ **构建优化**：SWC 编译器，速度提升 5-10 倍

### Web3 集成最佳实践

- ✅ **多链支持**：Sepolia（交易）+ Mainnet（ENS），无缝切换
- ✅ **钱包兼容**：RainbowKit 支持 MetaMask、WalletConnect、Coinbase 等
- ✅ **事件驱动**：实时监听合约事件，响应式 UI 更新
- ✅ **错误处理**：完善的交易状态追踪和用户友好提示
- ✅ **ENS 集成**：自动解析和显示 ENS 域名

### 代码质量保障

- ✅ **完整测试覆盖**：合约测试 + 单元测试 + E2E 测试
- ✅ **Git Hooks 自动化**：提交前自动 lint、格式化、类型检查
- ✅ **CI/CD 流水线**：PR 时自动运行全部测试
- ✅ **AI 代码审查**：DeepSeek AI 自动审查代码质量和安全性
- ✅ **代码规范**：ESLint + Prettier 统一代码风格

### 开发者体验（DX）

- ✅ **一键启动**：`pnpm install:all && pnpm dev:web` 即可开发
- ✅ **智能脚本**：自动化部署、ABI 同步、环境配置
- ✅ **清晰文档**：README + CLAUDE.md 双重文档支持
- ✅ **调试友好**：Source Map、详细错误日志、Playwright UI 模式
- ✅ **性能分析**：Webpack Bundle Analyzer 可视化分析

## 扩展建议

如果想将本项目用于生产环境或继续学习，可以考虑以下改进方向：

### 安全增强

- 🔧 集成 **Chainlink VRF** 实现真随机数分配
- 🔧 添加 **OpenZeppelin 安全库**（ReentrancyGuard、Pausable）
- 🔧 进行专业的 **智能合约审计**
- 🔧 实现 **提现机制** 允许发送者取回未领完的红包
- 🔧 添加 **红包过期机制**（时间锁定）

### 功能扩展

- 🚀 支持 **ERC20 代币红包**（除 ETH 外）
- 🚀 实现 **定向红包**（指定地址列表）
- 🚀 添加 **红包记录查询**（历史记录、排行榜）
- 🚀 支持 **红包口令/密码** 验证
- 🚀 集成 **社交分享** 功能（Twitter、Farcaster）

### 前端优化

- 🎨 添加 **3D 动画效果**（Three.js / Lottie）
- 🎨 实现 **PWA** 支持（离线使用）
- 🎨 添加 **暗黑模式** 切换
- 🎨 集成 **Web3 钱包签名登录**
- 🎨 支持 **多语言（i18n）**

### 性能与监控

- 📊 集成 **Sentry** 错误追踪
- 📊 添加 **Google Analytics** 或 **Mixpanel** 用户分析
- 📊 实现 **The Graph** 子图索引链上数据
- 📊 添加 **性能监控**（Web Vitals）
- 📊 使用 **IPFS** 存储红包祝福语/图片

### 测试与部署

- ✅ 增加 **单元测试覆盖率** 至 90%+
- ✅ 添加 **Fuzz Testing**（模糊测试）
- ✅ 部署到 **多个测试网**（Goerli、Polygon Mumbai）
- ✅ 准备 **主网部署** checklist
- ✅ 实现 **合约升级机制**（Proxy 模式）

## 学习资源

- [Solidity 官方文档](https://docs.soliditylang.org/)
- [Hardhat 文档](https://hardhat.org/docs)
- [wagmi 文档](https://wagmi.sh/)
- [RainbowKit 文档](https://www.rainbowkit.com/)
- [OpenZeppelin 合约库](https://docs.openzeppelin.com/contracts/)
- [Chainlink VRF](https://docs.chain.link/vrf)

## 许可

本项目代码仅用于学习与演示用途。

---

**开发者**: 致力于 Web3 DApp 开发实践
**最后更新**: 2025-10
**问题反馈**: 欢迎提交 Issue 或 Pull Request
