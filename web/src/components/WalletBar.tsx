import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useEnsName } from "wagmi";
import { Group, Title, Text, Paper } from "@mantine/core";

export function WalletBar() {
  const { address } = useAccount();
  const { data: ens } = useEnsName({ chainId: 1, address });

  return (
    <Paper withBorder p="sm" radius="md">
      <Group justify="space-between" align="center">
        <Title order={3}>链上抢红包 DApp</Title>
        <Group gap="sm">
          {address && (
            <Text size="sm" c="dimmed">{ens ?? address}</Text>
          )}
          <ConnectButton showBalance={false} />
        </Group>
      </Group>
    </Paper>
  );
}
