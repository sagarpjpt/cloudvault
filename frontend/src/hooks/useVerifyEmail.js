import { useState } from "react";
import { verifyEmailOtp } from "@/services/auth.api";

export const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verify = async (data) => {
    setLoading(true);
    setError("");

    try {
      await verifyEmailOtp(data);
      return true;
    } catch (err) {
      setError(
        err?.response?.data?.message || "Verification failed"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    verify,
    loading,
    error,
  };
};
