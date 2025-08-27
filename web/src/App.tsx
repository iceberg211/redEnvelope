import "./App.css";
import { WalletBar } from "./components/WalletBar";
import { SendPanel } from "./components/SendPanel";
import { ClaimPanel } from "./components/ClaimPanel";
import { Container, Grid } from "@mantine/core";

function App() {
  return (
    <Container size="md" py="md">
      <WalletBar />
      <Grid mt="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <SendPanel />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <ClaimPanel />
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default App;
