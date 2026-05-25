import React, { useEffect, useState } from "react";
import { getCaptcha, loginUser, registerUser } from "../api/authApi";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthPage() {
  const [captcha, setCaptcha] = useState(null);
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== "/signup");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
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

      // 🔥 SURGICAL FIX: Since native fetch doesn't throw on 400 errors,
      // the decoded backend error JSON lands right here!
      if (res && (res.errors || res.error || (res.detail && !res.access))) {
        setErrors(res.errors || res.error || { detail: res.detail });
        setSuccessMessage("");
        fetchCaptcha();
        return; // Stop execution
      }

      if (res && res.access) {
        localStorage.setItem("access", res.access);
        localStorage.setItem("refresh", res.refresh);

        // Extract role name for UI state (like Navbars)
        const userRole = res.user?.role_name || "CUSTOMER";
        localStorage.setItem("role", userRole);

        // Show success message and clear any errors
        setErrors({});
        setSuccessMessage(
          isLogin
            ? "Login successful! Redirecting..."
            : "Account created successfully! Redirecting...",
        );

        // Delay redirect by 1.5 seconds so the user can see the message
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      let backendErrors = {};

      // Handle pure network crashes or edge-case decoding failures
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

    // 1. Common required fields for BOTH Login and Registration
    if (!form.username) {
      newErrors.username = "Username is required";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    if (!form.captcha_answer) {
      newErrors.captcha = "Captcha is required";
    }

    // 2. Strict complex validations ONLY active during registration
    if (!isLogin) {
      // Email checking
      if (!form.email) {
        newErrors.email = "Email is required";
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net)$/.test(form.email)
      ) {
        newErrors.email = "Enter valid email (example@gmail.com)";
      }

      // Mobile checking
      if (!form.mobile) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^\d{10,15}$/.test(form.mobile)) {
        newErrors.mobile = "Mobile must be 10–15 digits";
      }

      // Password Confirmation presence
      if (!form.password_confirm) {
        newErrors.password_confirm = "Please confirm password";
      }

      // Password strength complexity checks (Only for registration!)
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

      // Match check
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
          {/* Toggle */}
          <div className="flex mb-8 bg-eatpur-white-warm p-1 rounded-xl overflow-hidden border border-black/5 shadow-inner">
            <button
              onClick={() => {
                setIsLogin(true);
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

          <h2 className="text-3xl font-display text-eatpur-dark mb-8 text-center tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="mb-6 p-3.5 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-medium flex items-center justify-center gap-2 shadow-sm animate-pulse">
              <span>✅</span> {successMessage}
            </div>
          )}

          {/* GLOBAL ERRORS SUMMARY */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium flex items-start gap-3 shadow-sm">
              <span className="text-lg leading-none mt-0.5">⚠️</span>
              <ul className="flex flex-col gap-1.5 list-disc list-inside w-full">
                {Object.entries(errors).map(([field, msg]) => {
                  // Normalize field name
                  const displayField =
                    field === "detail" || field === "non_field_errors"
                      ? "Error"
                      : field.replace(/_/g, " ");

                  // Safely extract string from array or object
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
              {/* Note: We handle fields globally above, but keeping this for immediate field context if needed */}
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
                    type="email"
                    placeholder="Email"
                    className="w-full p-3.5 rounded-xl bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors"
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
                <div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-3.5 rounded-xl bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors"
                    onChange={(e) =>
                      setForm({ ...form, password_confirm: e.target.value })
                    }
                  />
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

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3.5 rounded-xl bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
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
