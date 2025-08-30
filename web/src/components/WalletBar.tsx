import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useEnsName } from "wagmi";
import { Group, Title, Text, Paper } from "@mantine/core";

export function WalletBar() {
  const { address } = useAccount();
  const { data: ens } = useEnsName({ chainId: 1, address });

  return (
    <Paper
      radius="lg"
      p="md"
      shadow="sm"
      style={{ background: "linear-gradient(90deg, #fff7f7, #ffffff)" }}
    >
      <Group justify="space-between" align="center">
        <div>
          <Title order={3} c="red.8">
            链上抢红包 DApp
          </Title>
          <Text size="sm" c="dimmed">
            简单安全地发送与领取红包
          </Text>
        </div>
        <Group gap="sm">
          {address && (
            <Text size="sm" c="dimmed">
              {ens ?? address}
            </Text>
          )}
          <ConnectButton showBalance={false} />
        </Group>
      </Group>
    </Paper>
  );
}
