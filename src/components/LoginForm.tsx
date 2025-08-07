import { RequestMessage } from "@/types/login";
import { Button, TextField } from "@mui/material";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";

interface Props {
  onSubmit: (message: RequestMessage) => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const loginMutation = useMutation(api.mutations.login.login);
  const navigate = useNavigate();

  const { register, handleSubmit, watch } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const email = watch("email");
  const password = watch("password");
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const onSubmitForm = async (data: LoginFormData) => {
    setLoading(true);

    try {
      const result = await loginMutation({
        email: data.email,
        password: data.password,
      });

      if (result?.success) {
        props.onSubmit({ type: "success", text: "Login successful!" });
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            userId: result.userId,
            email: data.email,
          })
        );
        void navigate("/home");
      } else {
        props.onSubmit({
          type: "error",
          text: result?.error || "Login failed",
        });
      }
    } catch (error) {
      props.onSubmit({
        type: "error",
        text: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmitForm)(e)} style={{ width: "100%" }}>
      <TextField
        label="Email"
        type="email"
        {...register("email")}
        fullWidth
        variant="outlined"
        placeholder="your@email.com"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        {...register("password")}
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={!isFormValid || loading}
        fullWidth
        size="large"
        sx={{ color: "white" }}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};
