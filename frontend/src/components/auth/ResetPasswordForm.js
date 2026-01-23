"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import { useResetPassword } from "@/hooks/useResetPassword";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email");

  const { reset, loading, error, success } = useResetPassword();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const done = await reset({
      email: data.email,
      otp: data.otp,
      newPassword: data.password,
    });

    if (done) {
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Reset password"
        subtitle="Enter OTP and new password"
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && (
        <Alert severity="success">
          Password reset successful. Redirecting to login...
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="email"
          control={control}
          defaultValue={emailFromQuery || ""}
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              size="small"
              disabled={!!emailFromQuery}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <TextField
          label="OTP"
          fullWidth
          size="small"
          {...register("otp", { required: "OTP is required" })}
          error={!!errors.otp}
          helperText={errors.otp?.message}
        />

        <TextField
          label="New Password"
          type="password"
          fullWidth
          size="small"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Minimum 6 characters" },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button type="submit" fullWidth variant="contained" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthCard>
  );
}
