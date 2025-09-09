import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// 模拟 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 模拟 IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// 模拟 ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  observe(target: Element) {}
  unobserve(target: Element) {}
  disconnect() {}
};

// 模拟 Web3 相关 API
Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: {
    isMetaMask: true,
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
});

// 模拟环境变量
process.env.VITE_RP_SEPOLIA_RPC_URL = 'https://sepolia.infura.io/v3/test';
process.env.VITE_RP_WC_PROJECT_ID = 'test-project-id';

// 模拟 crypto.randomUUID
if (!global.crypto) {
  global.crypto = {} as Crypto;
}
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => 'test-uuid';
}

// 提供 TextEncoder/TextDecoder（viem 等依赖需要）
// @ts-ignore
if (!(global as any).TextEncoder) {
  // @ts-ignore
  (global as any).TextEncoder = TextEncoder;
}
// @ts-ignore
if (!(global as any).TextDecoder) {
  // @ts-ignore
  (global as any).TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}

// 抑制 console.error 对于已知的测试警告
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: componentWillReceiveProps'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};
