import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseEther, formatEther } from "viem";
import abiJson from "./abi/RedPacket.json";
import { addresses } from "./addresses";

export function useContractAddress(chainId?: number) {
  return chainId ? addresses[chainId] : undefined;
}

export function useCreateRedPacket(chainId?: number) {
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });
  const address = useContractAddress(chainId);
  const [loading, setLoading] = useState(false);
  const [lastCreatedId, setLastCreatedId] = useState<bigint | null>(null);

  const create = async (amountEth: string, count: number) => {
    if (!publicClient || !walletClient || !address)
      throw new Error("not ready");
    setLoading(true);
    try {
      // simulate to get expected id from return value
      const sim = await publicClient.simulateContract({
        address: address as `0x${string}`,
        abi: (abiJson as any).abi,
        functionName: "createRedPacket",
        args: [BigInt(count)],
        value: parseEther(amountEth),
        account: walletClient.account,
      });
      const id = sim.result as unknown as bigint;

      const hash = await walletClient.writeContract(sim.request);
      await publicClient.waitForTransactionReceipt({ hash });
      setLastCreatedId(id);
      return id;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, lastCreatedId };
}

export function useClaimRedPacket(chainId?: number) {
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });
  const address = useContractAddress(chainId);
  const [loading, setLoading] = useState(false);

  const claim = async (id: number | bigint) => {
    if (!publicClient || !walletClient || !address)
      throw new Error("not ready");
    setLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: address as `0x${string}`,
        abi: (abiJson as any).abi,
        functionName: "claimRedPacket",
        args: [BigInt(id)],
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    } finally {
      setLoading(false);
    }
  };

  return { claim, loading };
}

export function usePacketInfo(id?: number | bigint, chainId?: number) {
  const publicClient = usePublicClient({ chainId });
  const address = useContractAddress(chainId);
  const [info, setInfo] = useState<{
    sender: string;
    total: bigint;
    remaining: bigint;
    remainingCount: bigint;
    finished: boolean;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!publicClient || !address || id == null) return;
      try {
        const [sender, total, remaining, remainingCount, finished] =
          (await publicClient.readContract({
            address: address as `0x${string}`,
            abi: (abiJson as any).abi,
            functionName: "getPacket",
            args: [BigInt(id)],
          })) as any;
        if (!cancelled)
          setInfo({
            sender,
            total,
            remaining,
            remainingCount,
            finished,
          } as any);
      } catch (e) {
        if (!cancelled) setInfo(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [publicClient, address, id]);

  return info;
}

export function useEvents(idFilter?: number | bigint, chainId?: number) {
  const { chainId: connectedChainId } = useAccount();
  const publicClient = usePublicClient({
    chainId: chainId ?? connectedChainId,
  });
  const id = idFilter != null ? BigInt(idFilter) : undefined;
  const address = useContractAddress(chainId ?? connectedChainId);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!publicClient || !address) return;

    const unwatchers: Array<() => void> = [];

    // RedPacketCreated(id, sender, amount, count)
    unwatchers.push(
      publicClient.watchContractEvent({
        address: address as `0x${string}`,
        abi: (abiJson as any).abi,
        eventName: "RedPacketCreated",
        onLogs: (logs: any[]) => {
          logs.forEach((l) => {
            const { id: evId, sender, amount, count } = l.args as {
              id: bigint;
              sender: string;
              amount: bigint;
              count: bigint;
            };
            if (id == null || evId === id) {
              setMessages((m) => [
                `红包创建 [ID ${evId.toString()}]: 发送者 ${sender}, 金额 ${formatEther(
                  amount
                )} ETH, 份数 ${count.toString()}`,
                ...m,
              ]);
            }
          });
        },
      })
    );

    // RedPacketClaimed(id, user, amount)
    unwatchers.push(
      publicClient.watchContractEvent({
        address: address as `0x${string}`,
        abi: (abiJson as any).abi,
        eventName: "RedPacketClaimed",
        onLogs: (logs: any[]) => {
          logs.forEach((l) => {
            const { id: evId, user, amount } = l.args as { id: bigint; user: string; amount: bigint };
            if (id == null || evId === id) {
              setMessages((m) => [
                `抢到 [ID ${evId.toString()}]: ${formatEther(amount)} ETH (${user})`,
                ...m,
              ]);
            }
          });
        },
      })
    );

    // RedPacketFinished(id)
    unwatchers.push(
      publicClient.watchContractEvent({
        address: address as `0x${string}`,
        abi: (abiJson as any).abi,
        eventName: "RedPacketFinished",
        onLogs: (logs: any[]) => {
          logs.forEach((l) => {
            const { id: finishedId } = l.args as { id: bigint };
            if (id == null || finishedId === id) {
              setMessages((m) => ["红包已抢完", ...m]);
            }
          });
        },
      })
    );

    return () => {
      unwatchers.forEach((u) => u());
    };
  }, [publicClient, address, id]);

  return messages;
}

export function useHasClaimed(id?: number | bigint, chainId?: number, user?: string | undefined) {
  const { chainId: connectedChainId } = useAccount();
  const publicClient = usePublicClient({ chainId: chainId ?? connectedChainId });
  const address = useContractAddress(chainId ?? connectedChainId);
  const [has, setHas] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!publicClient || !address || id == null || !user) { setHas(null); return; }
      try {
        const result = await publicClient.readContract({
          address: address as `0x${string}`,
          abi: (abiJson as any).abi,
          functionName: "hasClaimed",
          args: [BigInt(id), user as `0x${string}`],
        });
        if (!cancelled) setHas(Boolean(result));
      } catch (e) {
        if (!cancelled) setHas(null);
      }
    })();
    return () => { cancelled = true; };
  }, [publicClient, address, id, user]);

  // react to on-chain Claim events to update immediately without manual refresh
  useEffect(() => {
    if (!publicClient || !address || id == null || !user) return;
    const unwatch = publicClient.watchContractEvent({
      address: address as `0x${string}`,
      abi: (abiJson as any).abi,
      eventName: "RedPacketClaimed",
      onLogs: (logs: any[]) => {
        logs.forEach((l) => {
          const { id: evId, user: evUser } = l.args as { id: bigint; user: `0x${string}` };
          if (evId === BigInt(id) && evUser?.toLowerCase() === (user as string).toLowerCase()) {
            setHas(true);
          }
        });
      },
    });
    return () => { unwatch?.(); };
  }, [publicClient, address, id, user]);

  return has;
}
