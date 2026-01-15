import api from "@/lib/axios";

// register user
export const registerUser = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

// verify email OTP
export const verifyEmailOtp = async (payload) => {
  const response = await api.post("/auth/verify-email", payload);
  return response.data;
};
