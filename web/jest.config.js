const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
  
  // 模块名映射
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub',
  },

  // 文件扩展名
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // 测试文件匹配模式
  testMatch: [
    '<rootDir>/test/unit/**/*.(ts|tsx|js|jsx)',
    '<rootDir>/test/unit/**/*.(test|spec).(ts|tsx|js|jsx)',
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js|jsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js|jsx)',
  ],

  // 覆盖率收集
  collectCoverageFrom: [
    'src/**/*.(ts|tsx|js|jsx)',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],

  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // 覆盖率报告
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',

  // 转换配置
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: false,
          dynamicImport: true,
        },
        target: 'es2022',
        loose: false,
        externalHelpers: false,
        keepClassNames: true,
        transform: {
          react: {
            runtime: 'automatic',
            development: true,
            refresh: false,
          },
        },
      },
      module: {
        type: 'es6',
      },
      sourceMaps: true,
    }],
    '^.+\\.(js|jsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'ecmascript',
          jsx: true,
          dynamicImport: true,
        },
        target: 'es2022',
        loose: false,
        externalHelpers: false,
        keepClassNames: true,
        transform: {
          react: {
            runtime: 'automatic',
            development: true,
            refresh: false,
          },
        },
      },
      module: {
        type: 'es6',
      },
      sourceMaps: true,
    }],
  },

  // 忽略的文件模式
  transformIgnorePatterns: [
    'node_modules/(?!(wagmi|viem|@rainbow-me|@mantine)/)',
  ],

  // 模块目录
  moduleDirectories: ['node_modules', '<rootDir>/src'],

  // 测试超时
  testTimeout: 10000,

  // 清除模拟
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  // 详细输出
  verbose: true,

  // 测试环境配置
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
};