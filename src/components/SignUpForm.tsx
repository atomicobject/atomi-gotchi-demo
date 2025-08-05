import { RequestMessage } from "@/types/login";
import { Button, TextField } from "@mui/material";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../convex/_generated/api";

interface Props {
  onSubmit: (message: RequestMessage) => void;
}

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUpForm = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const signUpMutation = useMutation(api.mutations.signUp.signUp);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<SignUpFormData>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmitForm = async (data: SignUpFormData) => {
    setLoading(true);

    const result = await signUpMutation({
      email: data.email,
      password: data.password,
    });

    if (result?.success) {
      // Save user to localStorage so ProtectedRoute works
      localStorage.setItem("currentUser", JSON.stringify({ email: data.email }));
      props.onSubmit({
        type: "success",
        text: "Sign up successful!",
      });
      // Redirect to pet creation page
      window.location.href = "/pet-creation";
    } else {
      props.onSubmit({
        type: "error",
        text: result?.error || "Sign up failed",
      });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmitForm)(e)}>
      <TextField
        label="Email"
        type="email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address",
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        variant="outlined"
        placeholder="your@email.com"
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <TextField
        label="Confirm Password"
        type="password"
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={!isValid || !isDirty || loading}
        fullWidth
        size="large"
        sx={{ color: "white" }}
      >
        {loading ? "..." : "Sign up"}
      </Button>
    </form>
  );
};
