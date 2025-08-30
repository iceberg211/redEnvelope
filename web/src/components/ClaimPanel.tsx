import { useAccount } from "wagmi";
import { useState } from "react";
import {
  useClaimRedPacket,
  useEvents,
  usePacketInfo,
  useHasClaimed,
} from "../features/redpacket/hooks";
import { Button, NumberInput, Paper, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";

export function ClaimPanel() {
  const { chainId, address } = useAccount();
  const [id, setId] = useState<number>(1);
  // Track last successfully claimed id locally to avoid blocking other ids
  const [claimedLocalId, setClaimedLocalId] = useState<number | null>(null);
  const { claim, loading } = useClaimRedPacket(chainId);
  const info = usePacketInfo(id, chainId);
  const events = useEvents(id, chainId);
  const hasClaimed = useHasClaimed(id, chainId, address);

  const onClaim = async () => {
    try {
      await claim(id);
      setClaimedLocalId(id);
      notifications.show({ title: "抢到红包", message: "查看上方事件提示" });
    } catch (e: any) {
      const msg = e?.shortMessage || e?.message || "抢红包失败";
      if (msg.includes("finished"))
        notifications.show({
          color: "yellow",
          title: "红包抢完了",
          message: "",
        });
      else if (msg.includes("already claimed"))
        notifications.show({
          color: "blue",
          title: "你已经抢过了",
          message: "",
        });
      else
        notifications.show({ color: "red", title: "抢红包失败", message: msg });
    }
  };

  return (
    <Paper radius="lg" p="md" shadow="md">
      <Title order={4} c="red.7">
        抢红包
      </Title>
      <Text size="sm" c="dimmed">
        输入红包ID，尝试好运气
      </Text>
      <Stack gap="sm" mt="md">
        <NumberInput
          label="红包ID"
          min={1}
          value={id}
          onChange={(v) => setId(Number(v) || 1)}
        />
        <Button
          onClick={onClaim}
          disabled={!address || hasClaimed === true || claimedLocalId === id}
          loading={loading}
          variant="gradient"
          gradient={{ from: "red", to: "pink", deg: 45 }}
        >
          抢红包
        </Button>
        <Text size="xs" c="dimmed">
          {info
            ? `剩余 ${info.remainingCount.toString()} 份，剩余金额 ${
                Number(info.remaining) / 1e18
              } ETH ${info.finished ? "(已抢完)" : ""}`
            : "暂无红包信息"}
        </Text>
        {(hasClaimed === true || claimedLocalId === id) && (
          <Text size="sm" c="blue.7">
            你已经抢过这个红包
          </Text>
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
