import { apiFetch } from "./client";

export const HomeAnalytics = () => {
  return apiFetch("/dashboard/");
};