import { Loading, Text, useTheme } from "@nextui-org/react";
import { useAppLoadingContext } from "../context/AppLoadingContext";

const AppLoader = () => {
  const { theme } = useTheme();
  const { isLoading } = useAppLoadingContext();

  if (!isLoading) return null;

  // TODO: these styles should not be inline but I am too lazy to do it
  return (
    <div
      style={{
        zIndex: 200,
        position: "absolute",
        width: "100%",
        height: "100vh",
        left: 0,
        top: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          backgroundColor: theme?.colors.blue900.value,
          opacity: 0.5,
        }}
      >
        <Loading size="xl" />
        <Text color={theme?.colors.gray200.value}>
          Transaction is being processed. It can take up to 15 seconds.
        </Text>
      </div>
    </div>
  );
};

export { AppLoader };
