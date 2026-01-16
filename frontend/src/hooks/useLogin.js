import { useState } from "react";
import { loginUser } from "@/services/auth.api";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);

  const login = async (data) => {
    setLoading(true);
    setError("");
    setNeedsVerification(false);

    try {
      const res = await loginUser(data);

      // backend explicitly sends success + token
      if (res.success && res.token) {
        localStorage.setItem("token", res.token);
        return true;
      }

      // fallback (should not normally happen)
      setError(res.message || "Login failed");
      return false;
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";

      if (message.toLowerCase().includes("verify")) {
        setNeedsVerification(true);
      }

      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // const sendOtp = async (data) => {
  //   setLoading(true);
  //   setError("");
  //   setNeedsVerification(false);
  //   try {
  //     const res = await send_Otp(data);

  //     if (res.success) {
  //       return true;
  //     }
  //     return false;
  //   } catch (err) {
  //     return false;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    login,
    loading,
    error,
    needsVerification,
  };
};
