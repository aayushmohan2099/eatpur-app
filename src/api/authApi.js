import { apiFetch } from "./client";

export const getCaptcha = () => {
  return apiFetch("/global/captcha/");
};

export const loginUser = (data) => {
  return apiFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const registerUser = (data) => {
  return apiFetch("/auth/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const refreshToken = (refresh) => {
  return apiFetch("/auth/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
};

export const getMe = () => {
  return apiFetch("/auth/me/");
};

export const logoutUser = (refresh) => {
  return apiFetch("/auth/logout/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
};
