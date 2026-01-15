"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import { useRegister } from "@/hooks/useRegister";


export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, loading, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const success = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (success) {
      router.push(`/verify-email?email=${data.email}`);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Create account"
        subtitle="Sign up to start using CloudVault"
      />

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField
          label="Name"
          fullWidth
          size="small"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Email"
          fullWidth
          size="small"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Password"
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
          {loading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <p className="text-sm text-center mt-6">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-[var(--color-primary)] hover:underline"
        >
          Login
        </a>
      </p>
    </AuthCard>
  );
}
