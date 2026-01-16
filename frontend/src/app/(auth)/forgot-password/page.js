"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import { useForgotPassword } from "@/hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const { sendOtp, loading, error, message } = useForgotPassword();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await sendOtp({ email: data.email });
    if (res) {
      // notify an reset link is sent to email
      console.log('reset link sent')
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Forgot password"
        subtitle="Enter your email to receive a reset OTP"
      />

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" className="mb-4">
          {message}
          {" "}
          redirecting to home...
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField
          label="Email"
          fullWidth
          size="small"
          {...register("email", {
            required: "Email is required",
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "var(--color-primary)",
            "&:hover": {
              backgroundColor: "var(--color-primary-hover)",
            },
            textTransform: "none",
            paddingY: "10px",
          }}
        >
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </AuthCard>
  );
}
