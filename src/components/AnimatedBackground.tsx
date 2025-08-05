import { Box, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface AnimatedBackgroundProps {
  children: ReactNode;
  animated?: boolean;
}

export const AnimatedBackground = ({ children, animated = true }: AnimatedBackgroundProps) => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const darkerBlue = theme.palette.primary.dark;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Animated checkered background */}
      <Box
        sx={{
          position: "absolute",
          top: "-100%",
          left: "-100%",
          right: "-100%",
          bottom: "-100%",
          zIndex: -1,
          background: `
            repeating-conic-gradient(
              ${primaryColor} 0% 25%, 
              ${darkerBlue} 25% 50%
            ) 0 0/180px 180px
          `,
          transform: "rotate(45deg)",
          animation: animated ? "scrollDown 8s linear infinite" : undefined,
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-100%",
            left: "-100%",
            right: "-100%",
            bottom: "-100%",
            height: "300%",
            width: "300%",
            background: `
              repeating-conic-gradient(
                ${primaryColor} 0% 25%, 
                ${darkerBlue} 25% 50%
              ) 0 0/180px 180px
            `,
          },
          "@keyframes scrollDown": {
            "0%": {
              transform: "rotate(45deg) translateY(0)",
            },
            "100%": {
              transform: "rotate(45deg) translateY(180px)",
            },
          },
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1, width: "100%" }}>
        {children}
      </Box>
    </Box>
  );
};
