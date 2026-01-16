import { useState } from "react";
import { resetPassword } from "@/services/auth.api";

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const reset = async (data) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await resetPassword(data);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(
        err?.response?.data?.message || "Reset failed"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    reset,
    loading,
    error,
    success,
  };
};
