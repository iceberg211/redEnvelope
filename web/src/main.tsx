import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './vendor.css';
import './index.css';
import App from './App';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { theme } from './theme';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MantineProvider theme={theme} defaultColorScheme='light'>
            <Notifications position='top-right' />
            <App />
          </MantineProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);

// 兼容 Webpack 5 的 ESM HMR 与旧式 HMR API
// React Refresh 已在 webpack 插件中启用，此处是补充手动接入（可选）。
// @ts-ignore
if ((import.meta as any)?.webpackHot) {
  // @ts-ignore
  (import.meta as any).webpackHot.accept();
  // @ts-ignore
} else if (typeof module !== 'undefined' && (module as any).hot) {
  // @ts-ignore
  (module as any).hot.accept();
}
