"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const { verify, loading, error } = useVerifyEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const success = await verify({
      email,
      otp: data.otp,
    });

    if (success) {
      router.push("/login");
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Verify your email"
        subtitle={
          email
            ? `Enter the OTP sent to ${email}`
            : "Enter the OTP sent to your email"
        }
      />

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField
          label="OTP"
          fullWidth
          size="small"
          {...register("otp", {
            required: "OTP is required",
            minLength: {
              value: 6,
              message: "OTP must be 6 digits",
            },
          })}
          error={!!errors.otp}
          helperText={errors.otp?.message}
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
          {loading ? "Verifying..." : "Verify Email"}
        </Button>
      </form>
    </AuthCard>
  );
}