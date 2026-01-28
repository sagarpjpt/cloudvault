import { useState } from "react";
import api from "@/lib/axios";

export const useActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivities = async (resourceType, resourceId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/activities/${resourceType}/${resourceId}`,
      );
      setActivities(response.data.data || []);
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch activities";
      setError(message);
      console.error("Error fetching activities:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/activities/me/activities");
      setActivities(response.data.data || []);
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch user activities";
      setError(message);
      console.error("Error fetching user activities:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    activities,
    loading,
    error,
    fetchActivities,
    fetchUserActivities,
  };
};
