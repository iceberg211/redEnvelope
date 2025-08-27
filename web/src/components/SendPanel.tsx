import { useAccount } from "wagmi";
import { useState } from "react";
import { useCreateRedPacket, useEvents } from "../features/redpacket/hooks";
import { Button, NumberInput, Paper, Stack, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export function SendPanel() {
  const { chainId } = useAccount();
  const { create, loading, lastCreatedId } = useCreateRedPacket(chainId);
  const events = useEvents(lastCreatedId ?? undefined, chainId);
  const [amount, setAmount] = useState("0.01");
  const [count, setCount] = useState(3);

  const onSend = async () => {
    try {
      const id = await create(amount, count);
      notifications.show({ title: "红包已发出", message: `ID: ${id?.toString()}` });
    } catch (e: any) {
      notifications.show({ color: "red", title: "发送失败", message: e?.shortMessage || e?.message || "" });
    }
  };

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={4}>发红包</Title>
      <Stack gap="sm" mt="sm">
        <TextInput label="金额 (ETH)" value={amount} onChange={(e) => setAmount(e.currentTarget.value)} />
        <NumberInput label="个数" min={1} value={count} onChange={(v) => setCount(Number(v) || 1)} />
        <Button onClick={onSend} loading={loading} variant="filled">发红包</Button>
        {lastCreatedId != null && <div>红包ID: {lastCreatedId.toString()}</div>}
      </Stack>
      <Stack gap={4} mt="sm">
        {events.map((m, i) => (
          <div key={i} style={{ fontSize: 12, color: "#666" }}>{m}</div>
        ))}
      </Stack>
    </Paper>
  );
}
