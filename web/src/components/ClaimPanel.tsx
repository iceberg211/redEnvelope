import { useAccount } from "wagmi";
import { useState } from "react";
import { useClaimRedPacket, useEvents, usePacketInfo } from "../features/redpacket/hooks";
import { Button, NumberInput, Paper, Stack, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export function ClaimPanel() {
  const { chainId, address } = useAccount();
  const [id, setId] = useState<number>(1);
  const { claim, loading } = useClaimRedPacket(chainId);
  const info = usePacketInfo(id, chainId);
  const events = useEvents(id, chainId);

  const onClaim = async () => {
    try {
      await claim(id);
      notifications.show({ title: "抢到红包", message: "查看上方事件提示" });
    } catch (e: any) {
      const msg = e?.shortMessage || e?.message || "抢红包失败";
      if (msg.includes("finished")) notifications.show({ color: "yellow", title: "红包抢完了", message: "" });
      else if (msg.includes("already claimed")) notifications.show({ color: "blue", title: "你已经抢过了", message: "" });
      else notifications.show({ color: "red", title: "抢红包失败", message: msg });
    }
  };

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={4}>抢红包</Title>
      <Stack gap="sm" mt="sm">
        <NumberInput label="红包ID" min={1} value={id} onChange={(v) => setId(Number(v) || 1)} />
        <Button onClick={onClaim} disabled={!address} loading={loading}>抢红包</Button>
        <div style={{ fontSize: 12, color: "#666" }}>
          {info
            ? `剩余 ${info.remainingCount.toString()} 份，剩余金额 ${Number(info.remaining) / 1e18} ETH ${info.finished ? "(已抢完)" : ""}`
            : "暂无红包信息"}
        </div>
      </Stack>
      <Stack gap={4} mt="sm">
        {events.map((m, i) => (
          <div key={i} style={{ fontSize: 12, color: "#666" }}>{m}</div>
        ))}
      </Stack>
    </Paper>
  );
}
