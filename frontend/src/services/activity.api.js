import api from "@/lib/axios";

export const getResourceActivities = async (
  resourceType,
  resourceId,
  limit = 50,
  offset = 0,
) => {
  try {
    const response = await api.get(
      `/activities/${resourceType}/${resourceId}?limit=${limit}&offset=${offset}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching resource activities:", error);
    throw error;
  }
};

export const getUserActivities = async (limit = 100, offset = 0) => {
  try {
    const response = await api.get(
      `/activities/me/activities?limit=${limit}&offset=${offset}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user activities:", error);
    throw error;
  }
};

export const getActivitiesByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get(
      `/activities/range/search?startDate=${startDate}&endDate=${endDate}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching activities by date range:", error);
    throw error;
  }
};
