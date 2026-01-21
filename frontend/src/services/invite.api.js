import api from "@/lib/axios";

// Get invite details (resource info) without accepting
export const getInviteDetails = async (token) => {
  const res = await api.get(`/invites/${token}/details`);
  return res.data; // { success, data: { resourceType, resourceId, resourceName, role, invitedBy } }
};

// Accept invite and create share (server-side redirect)
export const acceptInvite = async (token) => {
  // This makes a server-side redirect, so we use window.location
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/invites/${token}`;
};
