import { AnimatedBackground } from "@/components/AnimatedBackground";
import { PanelCard } from "@/components/PanelCard";
import { SignUpForm } from "@/components/SignUpForm";
import { RequestMessage } from "@/types/login";
import { ROUTES } from "@/types/navigation";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export const SignUpPage = () => {
  const [message, setMessage] = useState<RequestMessage | undefined>(undefined);
  const [hideSignUpForm, setHideSignUpForm] = useState(false);

  const onSignUp = (message: RequestMessage) => {
    setMessage(message);
    setHideSignUpForm(message.type === "success");
  };

  const animatedBg = localStorage.getItem("animatedBg") !== "false";
  return (
    <AnimatedBackground animated={animatedBg}>
      <PanelCard message={message} showLogo>
        {!hideSignUpForm && <SignUpForm onSubmit={onSignUp} />}
        <Stack direction="row" alignItems="center">
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Already have an account?
          </Typography>
          <Button component={Link} to={ROUTES.login} variant="text">
            Login here
          </Button>
        </Stack>
      </PanelCard>
    </AnimatedBackground>
  );
};
