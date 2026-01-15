import { useState } from "react";
import { registerUser } from "@/services/auth.api";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async (data) => {
    setLoading(true);
    setError("");

    try {
      await registerUser(data);
      return true;
    } catch (err) {
      setError(
        err?.response?.data?.message || "Registration failed"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
  };
};
