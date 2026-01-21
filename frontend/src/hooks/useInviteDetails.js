import { useEffect, useState } from "react";
import { getInviteDetails } from "@/services/invite.api";

export const useInviteDetails = (token) => {
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid invite link");
      setLoading(false);
      return;
    }

    const fetchInviteDetails = async () => {
      try {
        const res = await getInviteDetails(token);

        if (res.success) {
          setInvite(res.data);
        } else {
          setError(res.message || "Failed to load invite");
        }
      } catch (err) {
        console.error("Invite fetch error:", err);
        if (err.response?.status === 404) {
          setError("Invalid or expired invite");
        } else {
          setError(err.response?.data?.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInviteDetails();
  }, [token]);

  return {
    invite,
    loading,
    error,
  };
};
