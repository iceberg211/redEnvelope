import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from '@jest/globals';
import { useCreateRedPacket, useHasClaimed } from '@/features/redpacket/hooks';

// Fake viem helpers are not used directly here; hooks call the mocked clients.

// Mocks for wagmi hooks returning clients used by our hooks
const fakePublicClient: any = {
  simulateContract: vi.fn(async () => ({ result: 123n, request: { foo: 'bar' } })),
  waitForTransactionReceipt: vi.fn(async () => ({ status: 'success' })),
  readContract: vi.fn(async () => true),
  watchContractEvent: vi.fn(() => () => {}),
};
const fakeWalletClient: any = {
  account: '0x0000000000000000000000000000000000000000',
  writeContract: vi.fn(async () => '0xhash'),
};

vi.mock('wagmi', async () => {
  return {
    usePublicClient: () => fakePublicClient,
    useWalletClient: () => ({ data: fakeWalletClient }),
    useAccount: () => ({ chainId: 1, address: '0x0000000000000000000000000000000000000000' }),
  } as any;
});

describe('redpacket hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useCreateRedPacket creates and sets lastCreatedId', async () => {
    function Test() {
      const { create, loading, lastCreatedId } = useCreateRedPacket(1);
      return (
        <div>
          <button onClick={() => create('0.10', 3)} disabled={loading}>create</button>
          {lastCreatedId != null && (
            <span data-testid="created-id">{lastCreatedId.toString()}</span>
          )}
        </div>
      );
    }

    render(<Test />);
    fireEvent.click(screen.getByText('create'));

    await waitFor(() => {
      expect(screen.getByTestId('created-id').textContent).toBe('123');
    });

    expect(fakePublicClient.simulateContract).toHaveBeenCalledTimes(1);
    expect(fakeWalletClient.writeContract).toHaveBeenCalledTimes(1);
    expect(fakePublicClient.waitForTransactionReceipt).toHaveBeenCalledTimes(1);
  });

  it('useHasClaimed reads and returns true', async () => {
    function Test() {
      const has = useHasClaimed(1, 1, '0x0000000000000000000000000000000000000000');
      return <span data-testid="has">{String(has)}</span>;
    }

    render(<Test />);
    await waitFor(() => {
      expect(screen.getByTestId('has').textContent).toBe('true');
    });
    expect(fakePublicClient.readContract).toHaveBeenCalled();
  });
});

