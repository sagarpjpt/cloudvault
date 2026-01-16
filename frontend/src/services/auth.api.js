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

// login user 
export const loginUser = async (payload) => {
  const response = await api.post('/auth/login', payload)
  return response.data;
}

// forgot password
export const forgotPassword = async (payload) => {
  const response = await api.post("/auth/forgot-password", payload);
  return response.data;
};

// reset password
export const resetPassword = async (payload) => {
  const response = await api.post("/auth/reset-password", payload);
  return response.data;
};

