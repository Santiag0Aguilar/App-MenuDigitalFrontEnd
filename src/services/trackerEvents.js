import apiClient from "./api.js";

export const trackEvent = async (type, payload) => {
  // 1. Umami (espejo)
  if (window.umami) {
    window.umami.track(type, payload);
  }

  // 2. Tu backend (fuente de verdad)
  try {
    await apiClient.post("/analytics/event", {
      type,
      ...payload,
    });
  } catch (err) {
    console.warn("Analytics error:", err.message);
  }
};
