import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { useCreateRedPacket, useHasClaimed } from '@/features/redpacket/hooks';

// IMPORTANT: mock before importing hooks to ensure correct injection
const fakePublicClient: any = {
  simulateContract: jest.fn(async () => ({ result: 123n, request: { foo: 'bar' } })),
  waitForTransactionReceipt: jest.fn(async () => ({ status: 'success' })),
  readContract: jest.fn(async () => true),
  watchContractEvent: jest.fn(() => () => {}),
};
const fakeWalletClient: any = {
  account: '0x0000000000000000000000000000000000000000',
  writeContract: jest.fn(async () => '0xhash'),
};

jest.mock('wagmi', () => {
  return {
    usePublicClient: () => fakePublicClient,
    useWalletClient: () => ({ data: fakeWalletClient }),
    useAccount: () => ({
      chainId: 11155111,
      address: '0x0000000000000000000000000000000000000000',
    }),
  } as any;
});



describe('redpacket hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('useCreateRedPacket creates and sets lastCreatedId', async () => {
    // 明确设置返回值，避免潜在的 mock 覆盖
    fakePublicClient.simulateContract.mockResolvedValue({
      result: 123n,
      request: { foo: 'bar' },
    } as any);
    fakeWalletClient.writeContract.mockResolvedValue('0xhash' as any);
    fakePublicClient.waitForTransactionReceipt.mockResolvedValue({ status: 'success' } as any);

    function Test() {
      const { create, loading, lastCreatedId } = useCreateRedPacket(11155111);
      return (
        <div>
          <button onClick={() => create('0.10', 3)} disabled={loading}>
            create
          </button>
          {lastCreatedId != null && (
            <span data-testid='created-id'>{lastCreatedId.toString()}</span>
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
    fakePublicClient.readContract.mockResolvedValue(true as any);
    function Test() {
      const has = useHasClaimed(1, 11155111, '0x0000000000000000000000000000000000000000');
      return <span data-testid='has'>{String(has)}</span>;
    }

    render(<Test />);
    await waitFor(() => {
      expect(screen.getByTestId('has').textContent).toBe('true');
    });
    expect(fakePublicClient.readContract).toHaveBeenCalled();
  });
});
