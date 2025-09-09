import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import App from './App';

// 模拟 wagmi 和 RainbowKit
jest.mock('wagmi', () => ({
  WagmiProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@rainbow-me/rainbowkit', () => ({
  RainbowKitProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ConnectButton: () => <button>Connect Wallet</button>,
}));

jest.mock('@mantine/core', () => ({
  MantineProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@mantine/notifications', () => ({
  Notifications: () => <div>Notifications</div>,
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
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