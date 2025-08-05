import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LoginForm } from "@/components/LoginForm";
import { PanelCard } from "@/components/PanelCard";
import { RequestMessage } from "@/types/login";
import { ROUTES } from "@/types/navigation";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export const LoginPage = () => {
  const [message, setMessage] = useState<RequestMessage | undefined>(undefined);
  const animatedBg = localStorage.getItem("animatedBg") !== "false";

  return (
    <AnimatedBackground animated={animatedBg}>
      <PanelCard message={message} showLogo>
        <LoginForm onSubmit={setMessage} />
        <Stack direction="row" alignItems="center">
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Don't have an account?
          </Typography>
          <Button component={Link} to={ROUTES.signup} variant="text">
            Sign up here
          </Button>
        </Stack>
      </PanelCard>
    </AnimatedBackground>
  );
};
