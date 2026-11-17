import { BACKEND_URL } from "./config.js";

async function request(path, options = {}) {
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not set in app.json");
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

export const Api = {
  getSensorReadings(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page != null) searchParams.append("page", String(params.page));
    if (params.limit != null) searchParams.append("limit", String(params.limit));
    const qs = searchParams.toString();
    return request(`/api/readings${qs ? `?${qs}` : ""}`);
  },
  getThresholds(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page != null) searchParams.append("page", String(params.page));
    if (params.limit != null) searchParams.append("limit", String(params.limit));
    const qs = searchParams.toString();
    return request(`/api/thresholds${qs ? `?${qs}` : ""}`);
  },
  createThreshold(payload) {
    return request("/api/thresholds", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
