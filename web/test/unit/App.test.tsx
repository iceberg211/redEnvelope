import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import App from '@/App';

// 模拟 wagmi 和 RainbowKit
jest.mock('wagmi', () => ({
  WagmiProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAccount: () => ({ address: '0x0000000000000000000000000000000000000000' }),
  useEnsName: () => ({ data: null }),
}));

jest.mock('@rainbow-me/rainbowkit', () => ({
  RainbowKitProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ConnectButton: () => <button>Connect Wallet</button>,
}));

// 避免引入复杂的区块链交互逻辑，直接桩件化两个面板
jest.mock('@/components/SendPanel', () => ({
  SendPanel: () => <div>SendPanel</div>,
}));
jest.mock('@/components/ClaimPanel', () => ({
  ClaimPanel: () => <div>ClaimPanel</div>,
}));

jest.mock('@mantine/core', () => {
  const React = require('react');
  const Grid = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  // @ts-ignore attach Col subcomponent
  Grid.Col = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  return {
    MantineProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Group: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Title: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
    Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    Paper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Grid,
  };
});

jest.mock('@mantine/notifications', () => ({
  Notifications: () => <div>Notifications</div>,
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('contains the application title', () => {
    render(<App />);
    expect(screen.getByText(/链上抢红包/)).toBeInTheDocument();
  });

  it('has wallet connection functionality', () => {
    render(<App />);
    expect(screen.getByText(/Connect Wallet/)).toBeInTheDocument();
  });
});
