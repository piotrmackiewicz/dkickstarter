import { ReactNode } from "react";
import { Button, Container, Link, Navbar, Text } from "@nextui-org/react";
import { ROUTES } from "../consts";
import { AppLoader } from "./AppLoader";
import { AppLoadingProvider } from "../context/AppLoadingContext";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <AppLoadingProvider>
      <div style={{ position: "relative" }}>
        <Navbar variant="floating">
          <Navbar.Brand>
            <Link href={ROUTES.Home}>
              <Text h4 b color="inherit" hideIn="xs">
                dKickstarter
              </Text>
            </Link>
          </Navbar.Brand>
          <Navbar.Content>
            <Navbar.Item>
              <Button auto flat as={Link} href={ROUTES.CreateCampaign}>
                Create Campaign
              </Button>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
        <main>
          <Container lg>{children}</Container>
        </main>
        <AppLoader />
      </div>
    </AppLoadingProvider>
  );
};

export { Layout };
