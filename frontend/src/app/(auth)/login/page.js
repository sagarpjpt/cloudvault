"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import { useLogin } from "@/hooks/useLogin";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, needsVerification } = useLogin();
  const [otpLoading, setOtpLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const email = watch("email");

  const unVerified = async (email) => {
    setOtpLoading(true);
    try {
      const response = await api.post("/auth/send-otp", {
        email: email,
      });
      if (response.data.success) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (e) {
      console.log(e);
      setOtpLoading(false);
    }
  };

  const onSubmit = async (data) => {
    const success = await login({
      email: data.email,
      password: data.password,
    });

    if (success && !needsVerification) {
      router.push("/");
      toast.success("Logged In!")
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Welcome back"
        subtitle="Login to your CloudVault account"
      />

      {error && (
        <Alert severity="error" className="mb-4">
          {error}

          {needsVerification && email && (
            <div className="mt-2">
              <p
                className="underline text-sm font-bold cursor-pointer flex items-center gap-2"
                onClick={() => !otpLoading && unVerified(email)}
                style={{
                  opacity: otpLoading ? 0.6 : 1,
                  pointerEvents: otpLoading ? "none" : "auto",
                }}
              >
                {otpLoading ? (
                  <>
                    <CircularProgress size={16} /> Sending OTP...
                  </>
                ) : (
                  "Verify email"
                )}
              </p>
            </div>
          )}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="email"
          control={control}
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              size="small"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
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
            py: "10px",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="text-sm text-center mt-6 space-y-2">
        <Link
          href="/forgot-password"
          className="text-[var(--color-primary)] hover:underline block"
        >
          Forgot password?
        </Link>

        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[var(--color-primary)] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
