import { apiFetch } from "./client";

export const getCaptcha = () => {
  return apiFetch("/auth/captcha/");
};

export const loginUser = (data) => {
  return apiFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getMe = (token) => {
  return apiFetch("/auth/me/");
};
