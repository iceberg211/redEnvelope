请帮我完成一个 **链上抢红包 DApp**，要求如下：

### 🎨 界面需求

1. 页面顶部：

   - 使用 **wagmi + connectkit 或 rainbowkit** 实现钱包连接与切换。
   - 展示已连接的钱包地址与 **ENS Name**（如果有）。

2. 主界面模块：

   - **发红包模块**：输入红包金额、红包个数 → 生成红包。
   - **抢红包模块**：展示红包剩余情况，用户可点击“抢红包”按钮参与。
   - **状态提示**：通过事件监听，实时提示用户操作结果。

---

### ⚖️ 合约需求（部署到 Sepolia 测试网）

1. 编写并部署一个 **“红包合约”**，核心功能：

   - **发红包**：指定总金额、份数，写入链上。
   - **抢红包**：用户调用 `claim()` 方法，从红包池里随机领取金额。
   - **限制条件**：

     - 每个用户只能抢一次。
     - 抢完后自动结算，合约状态更新为“已抢完”。

2. 使用 **事件（event）机制** 提供前端监听：

   - `event RedPacketCreated(address indexed sender, uint amount, uint count)`
   - `event RedPacketClaimed(address indexed user, uint amount)`
   - `event RedPacketFinished(uint id)`

---

### 🛠️ 前端交互

1. 发红包的人：

   - 输入金额 + 份数，点击“发红包”，调用合约 `createRedPacket()`。
   - 前端监听合约事件，显示“红包已发出”。

2. 抢红包的人：

   - 点击“抢红包”，调用合约 `claimRedPacket()`。
   - 根据事件结果返回提示：

     - 抢到金额（数值展示）。
     - **友好提示**：

       - “红包抢完了”
       - “你已经抢过了”

---

### 📦 技术栈要求

- **前端**：React + vite (使用 cli 进行项目初始化) + 使用比较成熟的组件库
- **区块链交互**：`ethers.js` + wagmi
- **钱包集成**：connectkit 或 rainbowkit
- **合约开发**：Solidity，部署到 Sepolia，测试使用 Hardhat 框架，使用 Hardhat 命令进行初始化。
- **事件监听**：前端通过 `ethers.js` 订阅合约事件，实时更新 UI

---

### 项目结构

```
redpacket-dapp/
├─ contracts/                    # 合约&部署
│  ├─ src/
│  │  └─ RedPacket.sol
│  ├─ scripts/
│  │  ├─ deploy.ts              # 部署到 Sepolia，写出地址/ABI
│  │  └─ verify.ts              # 验证合约（可选）
│  ├─ test/
│  │  └─ RedPacket.test.ts
│  ├─ artifacts/                # 编译产物(自动生成，前端要用ABI)
│  ├─ typechain-types/          # 类型(自动生成)
│  ├─ hardhat.config.ts         # 或 foundry.toml（二选一）
│  └─ package.json
│
├─ web/                          # 前端(Next.js 或 Vite + React)
│  ├─ app/ or src/
│  │  ├─ pages/                  # (Next.js) 页面路由
│  │  ├─ components/
│  │  │  ├─ WalletBar.tsx       # 顶部钱包组件(地址/ENS/切换)
│  │  │  ├─ SendPanel.tsx       # 发红包
│  │  │  └─ ClaimPanel.tsx      # 抢红包
│  │  ├─ features/redpacket/
│  │  │  ├─ hooks.ts            # useCreate、useClaim、事件订阅
│  │  │  ├─ abi/                # 引入contracts输出的ABI
│  │  │  └─ addresses.ts        # 各网络合约地址
│  │  └─ lib/
│  │     ├─ wagmi.ts            # wagmi 配置(rainbowkit/connectkit)
│  │     └─ ens.ts              # 解析 ENS（可合并到wagmi）
│  ├─ public/
│  ├─ env.d.ts
│  ├─ next.config.js / vite.config.ts
│  └─ package.json
│
├─ shared/                       # 前后端共享(可选，简化同步ABI/地址)
│  ├─ abis/RedPacket.json
│  └─ addresses.json
│
├─ .env.example                  # 环境变量样例
├─ package.json                  # 根脚本(一键build/dev)
└─ pnpm-workspace.yaml           # 用pnpm管理(可选)

```

### ✅ 验收标准

- 页面顶部可切换钱包并显示地址/ENS Name。
- 发红包成功后，链上有记录，事件通知前端。
- 抢红包成功/失败后，前端有对应提示。
- 红包抢完 → 所有用户界面显示“已抢完”。
- 一个用户重复抢 → 显示“你已经抢过了”。
