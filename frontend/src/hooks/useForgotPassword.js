import { useState } from "react";
import { forgotPassword } from "@/services/auth.api";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async (data) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await forgotPassword(data);
      setMessage(res.message || "OTP sent to your email");
      return true;
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to send OTP"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOtp,
    loading,
    error,
    message,
  };
};
