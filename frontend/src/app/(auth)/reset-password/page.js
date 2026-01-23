"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { Controller } from "react-hook-form";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import { useResetPassword } from "@/hooks/useResetPassword";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { reset, loading, error, success } = useResetPassword();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email");

  const {
    register,
    handleSubmit,
    control,
    // Controller,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const done = await reset({
      email: data.email,
      otp: data.otp,
      newPassword: data.password,
    });

    if (done) {
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Reset password"
        subtitle="Enter OTP and new password"
      />

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="mb-4">
          Password reset successful. Redirecting to login...
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* <TextField
          label="Email"
          fullWidth
          size="small"
          {...register("email", {
            required: "Email is required",
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        /> */}

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
          {...register("otp", {
            required: "OTP is required",
          })}
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
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
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
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthCard>
  );
}
