import { useAccount } from "wagmi";
import { useState } from "react";
import { useCreateRedPacket, useEvents } from "../features/redpacket/hooks";
import {
  Button,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
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
      notifications.show({
        title: "红包已发出",
        message: `ID: ${id?.toString()}`,
      });
    } catch (e: any) {
      notifications.show({
        color: "red",
        title: "发送失败",
        message: e?.shortMessage || e?.message || "",
      });
    }
  };

  return (
    <Paper radius="lg" p="md" shadow="md">
      <Title order={4} c="red.7">
        发红包
      </Title>
      <Text size="sm" c="dimmed">
        设置金额与个数，立即发送
      </Text>
      <Stack gap="sm" mt="md">
        <TextInput
          label="金额 (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.currentTarget.value)}
        />
        <NumberInput
          label="个数"
          min={1}
          value={count}
          onChange={(v) => setCount(Number(v) || 1)}
        />
        <Button
          onClick={onSend}
          loading={loading}
          variant="gradient"
          gradient={{ from: "red", to: "pink", deg: 45 }}
        >
          发红包
        </Button>
        {lastCreatedId != null && (
          <Text size="sm">红包ID: {lastCreatedId.toString()}</Text>
        )}
      </Stack>
      <Stack gap={4} mt="sm">
        {events.map((m, i) => (
          <Text key={i} size="xs" c="dimmed" ff="monospace">
            {m}
          </Text>
        ))}
      </Stack>
    </Paper>
  );
}
