import React, { useEffect, useState } from "react";
import {
  getCaptcha,
  loginUser,
  registerUser,
  socialAuth,
} from "../api/authApi";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function AuthPage() {
  const [captcha, setCaptcha] = useState(null);
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== "/signup");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isEmailLocked, setIsEmailLocked] = useState(false);

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
    age: "",
    password: "",
    password_confirm: "",
    captcha_answer: "",
  });

  const navigate = useNavigate();

  const fetchCaptcha = async () => {
    const data = await getCaptcha();
    setCaptcha(data);
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await socialAuth({
        provider: "google",
        token: credentialResponse.credential,
      });

      if (res && res.access) {
        localStorage.setItem("access", res.access);
        localStorage.setItem("refresh", res.refresh);
        localStorage.setItem("role", res.user?.role_name || "CUSTOMER");

        setErrors({});
        setSuccessMessage("Google Login successful! Redirecting...");
        setTimeout(() => {
          navigate(location.state?.returnTo || "/");
        }, 1500);
      } else if (res && res.action === "requires_registration") {
        setIsLogin(false);
        setForm((prev) => ({ ...prev, email: res.email }));
        setIsEmailLocked(true);
        setErrors({});
        setSuccessMessage(
          "Google email verified! Please complete your details to register.",
        );
      }
    } catch (err) {
      console.error(err);
      setErrors({ detail: "Google authentication failed or server error." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...form,
      captcha_id: captcha?.captcha_id,
    };

    try {
      let res;

      if (isLogin) {
        res = await loginUser(payload);
      } else {
        res = await registerUser(payload);
      }

      if (res && (res.errors || res.error || (res.detail && !res.access))) {
        setErrors(res.errors || res.error || { detail: res.detail });
        setSuccessMessage("");
        fetchCaptcha();
        return;
      }

      if (res && res.access) {
        localStorage.setItem("access", res.access);
        localStorage.setItem("refresh", res.refresh);
        const userRole = res.user?.role_name || "CUSTOMER";
        localStorage.setItem("role", userRole);

        setErrors({});
        setSuccessMessage(
          isLogin
            ? "Login successful! Redirecting..."
            : "Account created successfully! Redirecting...",
        );

        setTimeout(() => {
          navigate(location.state?.returnTo || "/");
        }, 1500);
      }
    } catch (err) {
      let backendErrors = {};
      const rawBase64 = err?.response?.data?.data || err?.data;

      if (typeof rawBase64 === "string") {
        try {
          const standard = rawBase64.replace(/-/g, "+").replace(/_/g, "/");
          const padded = standard.padEnd(
            standard.length + ((4 - (standard.length % 4)) % 4),
            "=",
          );
          const decodedStr = new TextDecoder().decode(
            Uint8Array.from(atob(padded), (m) => m.codePointAt(0)),
          );

          if (decodedStr.startsWith("HEALTHY_LIFE")) {
            const parsed = JSON.parse(decodedStr.slice(12));
            backendErrors = parsed.errors || parsed;
          } else {
            backendErrors = { detail: "Invalid secure response prefix." };
          }
        } catch (e) {
          backendErrors = { detail: "Failed to parse secure server response." };
        }
      } else if (err?.response?.data?.errors || err?.errors) {
        backendErrors = err?.response?.data?.errors || err?.errors;
      } else if (typeof err?.message === "string") {
        backendErrors = { detail: err.message };
      } else {
        backendErrors = {
          detail: "Authentication failed. Please check your details.",
        };
      }

      setSuccessMessage("");
      setErrors(backendErrors);
      fetchCaptcha();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username) newErrors.username = "Username is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.captcha_answer) newErrors.captcha = "Captcha is required";

    if (!isLogin) {
      if (!form.email) {
        newErrors.email = "Email is required";
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net)$/.test(form.email)
      ) {
        newErrors.email = "Enter valid email (example@gmail.com)";
      }

      if (!form.mobile) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^\d{10,15}$/.test(form.mobile)) {
        newErrors.mobile = "Mobile must be 10–15 digits";
      }

      if (!form.age) {
        newErrors.age = "Age is required";
      }

      if (!form.password_confirm) {
        newErrors.password_confirm = "Please confirm password";
      }

      if (form.password) {
        if (form.password.length < 8) {
          newErrors.password = "Minimum 8 characters required";
        } else if (!/[A-Z]/.test(form.password)) {
          newErrors.password = "Must include uppercase letter";
        } else if (!/[0-9]/.test(form.password)) {
          newErrors.password = "Must include a digit";
        } else if (!/[!@#$%^&*]/.test(form.password)) {
          newErrors.password = "Must include special character";
        }
      }

      if (
        form.password &&
        form.password_confirm &&
        form.password !== form.password_confirm
      ) {
        newErrors.password_confirm = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-eatpur-white-warm text-eatpur-dark px-4 pt-24 pb-12 relative z-10 transition-colors">
      <div className="w-full max-w-5xl vintage-card bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 grid md:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-eatpur-green-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />
          {isLogin ? (
            <div className="relative z-10">
              <h1 className="text-4xl font-display text-white mb-6 tracking-wide drop-shadow-sm">
                Welcome Back 👋
              </h1>
              <p className="text-white/80 font-serif italic text-lg leading-relaxed">
                Login to continue your EatPur journey. Fresh meals. Clean
                lifestyle. Premium experience.
              </p>
            </div>
          ) : (
            <div className="relative z-10">
              <h1 className="text-3xl font-display text-white mb-6 tracking-wide drop-shadow-sm">
                Create Your Account 🚀
              </h1>
              <ul className="text-white/80 space-y-3 font-serif text-[15px]">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white opacity-70"></span>{" "}
                  Username must be unique
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white opacity-70"></span>{" "}
                  Enter a valid email (example@gmail.com)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white opacity-70"></span>{" "}
                  Mobile must be exactly 10 digits
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-white opacity-70 mt-2"></span>
                  <div>
                    Password must include:
                    <ul className="ml-4 mt-1 space-y-1 text-white/70 italic text-sm">
                      <li>- 8+ characters</li>
                      <li>- 1 uppercase letter</li>
                      <li>- 1 number</li>
                      <li>- 1 special character</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white opacity-70"></span>{" "}
                  Confirm password must match
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white opacity-70"></span>{" "}
                  Complete CAPTCHA to verify
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="flex mb-8 bg-eatpur-white-warm p-1 rounded-xl overflow-hidden border border-black/5 shadow-inner">
            <button
              onClick={() => {
                setIsLogin(true);
                setIsEmailLocked(false);
                navigate("/login");
              }}
              className={`w-1/2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                isLogin
                  ? "bg-white text-eatpur-green-dark shadow-sm border border-black/5"
                  : "text-eatpur-text-light hover:text-eatpur-dark"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setIsEmailLocked(false);
                navigate("/signup");
              }}
              className={`w-1/2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                !isLogin
                  ? "bg-white text-eatpur-green-dark shadow-sm border border-black/5"
                  : "text-eatpur-text-light hover:text-eatpur-dark"
              }`}
            >
              Register
            </button>
          </div>

          <h2 className="text-3xl font-display text-eatpur-dark mb-6 text-center tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrors({ detail: "Google Login Failed" })}
              theme="outline"
              size="large"
              shape="rectangular"
              text={isLogin ? "signin_with" : "signup_with"}
            />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <hr className="w-full border-black/10" />
            <span className="text-xs text-eatpur-text-light font-medium uppercase tracking-wider">
              OR
            </span>
            <hr className="w-full border-black/10" />
          </div>

          {successMessage && (
            <div className="mb-6 p-3.5 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-medium flex items-center justify-center gap-2 shadow-sm animate-pulse">
              <span>✅</span> {successMessage}
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium flex items-start gap-3 shadow-sm">
              <span className="text-lg leading-none mt-0.5">⚠️</span>
              <ul className="flex flex-col gap-1.5 list-disc list-inside w-full">
                {Object.entries(errors).map(([field, msg]) => {
                  const displayField =
                    field === "detail" || field === "non_field_errors"
                      ? "Error"
                      : field.replace(/_/g, " ");

                  let displayMsg = msg;
                  if (Array.isArray(msg)) {
                    displayMsg = msg.join(" | ");
                  } else if (typeof msg === "object" && msg !== null) {
                    displayMsg = JSON.stringify(msg);
                  }

                  return (
                    <li key={field} className="break-words">
                      <span className="capitalize font-bold mr-1">
                        {displayField}:
                      </span>
                      {displayMsg}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3.5 rounded-xl bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                  {Array.isArray(errors.username)
                    ? errors.username[0]
                    : errors.username}
                </p>
              )}
            </div>

            {!isLogin && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={form.mobile}
                    maxLength={10}
                    className="w-full p-3.5 rounded-xl bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setForm({ ...form, mobile: value });
                    }}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                      {Array.isArray(errors.mobile)
                        ? errors.mobile[0]
                        : errors.mobile}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="age"
                    placeholder="Tell us your age"
                    className="w-full p-3.5 rounded-xl bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors"
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                      {Array.isArray(errors.age) ? errors.age[0] : errors.age}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    readOnly={isEmailLocked}
                    className={`w-full p-3.5 rounded-xl outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors ${
                      isEmailLocked
                        ? "bg-green-50 border border-eatpur-green-dark/50 text-eatpur-green-dark font-medium cursor-not-allowed"
                        : "bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark"
                    }`}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                      {Array.isArray(errors.email)
                        ? errors.email[0]
                        : errors.email}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input with Fixed Eye Icon */}
                <div>
                  <div className="relative w-full">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="w-full p-3.5 pr-12 rounded-xl bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors"
                      onChange={(e) =>
                        setForm({ ...form, password_confirm: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-eatpur-dark focus:outline-none flex items-center justify-center"
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password_confirm && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                      {Array.isArray(errors.password_confirm)
                        ? errors.password_confirm[0]
                        : errors.password_confirm}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Password Input with Fixed Eye Icon */}
            <div>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3.5 pr-12 rounded-xl bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-eatpur-dark focus:outline-none flex items-center justify-center"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                  {Array.isArray(errors.password)
                    ? errors.password[0]
                    : errors.password}
                </p>
              )}
            </div>

            {/* CAPTCHA */}
            {captcha && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between bg-eatpur-white-warm p-2 rounded-xl border border-black/5 shadow-inner">
                  <img
                    src={captcha.captcha_image}
                    alt="captcha"
                    className="h-10 rounded bg-white mix-blend-multiply"
                  />
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    className="text-xs font-semibold text-eatpur-green-dark hover:text-eatpur-dark transition-colors px-3 py-1 bg-white border border-black/5 rounded shadow-sm mr-1"
                  >
                    Refresh
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Enter CAPTCHA"
                    className="w-full p-3.5 rounded-xl bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors text-center font-medium tracking-widest text-lg uppercase"
                    onChange={(e) =>
                      setForm({ ...form, captcha_answer: e.target.value })
                    }
                  />
                  {errors.captcha && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium text-center">
                      {Array.isArray(errors.captcha)
                        ? errors.captcha[0]
                        : errors.captcha}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4">
              <button className="btn-primary w-full py-3.5 text-base tracking-wide font-medium shadow-md">
                {isLogin ? "Sign In" : "Register & Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
