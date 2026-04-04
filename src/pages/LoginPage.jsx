import React, { useEffect, useState } from "react";
import { getCaptcha, loginUser, registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [captcha, setCaptcha] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});

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

      if (res.access) {
        localStorage.setItem("access", res.access);
        localStorage.setItem("refresh", res.refresh);
        navigate("/user/dashboard");
      }
    } catch (err) {
      const backendErrors = err?.errors || {};

      setErrors((prev) => ({
        ...prev,
        ...backendErrors,
      }));

      fetchCaptcha();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.username) {
      newErrors.username = "Username is required";
    }

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

      if (!form.password_confirm) {
        newErrors.password_confirm = "Please confirm password";
      }
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else {
      if (form.password.length < 8) {
        newErrors.password = "Minimum 8 characters required";
      }
      if (!/[A-Z]/.test(form.password)) {
        newErrors.password = "Must include uppercase letter";
      }
      if (!/[0-9]/.test(form.password)) {
        newErrors.password = "Must include a digit";
      }
      if (!/[!@#$%^&*]/.test(form.password)) {
        newErrors.password = "Must include special character";
      }
    }

    if (!isLogin && form.password !== form.password_confirm) {
      newErrors.password_confirm = "Passwords do not match";
    }

    if (!form.captcha_answer) {
      newErrors.captcha = "Captcha is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1f0f] to-black text-white px-4">
      <div className="w-full max-w-5xl bg-[#0f1f14] rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-green-700 to-green-900">
          {isLogin ? (
            <>
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome Back 👋
              </h1>
              <p className="text-white/80">
                Login to continue your EatPur journey. Fresh meals. Clean
                lifestyle. Premium experience.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-white mb-4">
                Create Your Account 🚀
              </h1>

              <ul className="text-white/80 space-y-2 text-sm">
                <li>• Username must be unique</li>
                <li>• Enter a valid email (example@gmail.com)</li>
                <li>• Mobile must be exactly 10 digits</li>
                <li>• Password must include:</li>
                <li className="ml-4">- 8+ characters</li>
                <li className="ml-4">- 1 uppercase letter</li>
                <li className="ml-4">- 1 number</li>
                <li className="ml-4">- 1 special character</li>
                <li>• Confirm password must match</li>
                <li>• Complete CAPTCHA to verify</li>
              </ul>
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 md:p-10 bg-[#0b1a10]">
          {/* Toggle */}
          <div className="flex mb-6 bg-black/30 rounded-xl overflow-hidden">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 text-sm ${
                isLogin ? "bg-yellow-400 text-black" : "text-gray-400"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 text-sm ${
                !isLogin ? "bg-yellow-400 text-black" : "text-gray-400"
              }`}
            >
              Register
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-6">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 rounded-lg bg-black border border-white/10 focus:border-yellow-400 outline-none"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            {errors.username && (
              <p className="text-red-400 text-xs">{errors.username}</p>
            )}

            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={form.mobile}
                  maxLength={10}
                  className="w-full p-3 rounded-lg bg-black border border-white/10"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    setForm({ ...form, mobile: value });
                  }}
                />
                {errors.mobile && (
                  <p className="text-red-400 text-xs">{errors.mobile}</p>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 rounded-lg bg-black border border-white/10 focus:border-yellow-400 outline-none"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-3 rounded-lg bg-black border border-white/10"
                  onChange={(e) =>
                    setForm({ ...form, password_confirm: e.target.value })
                  }
                />
                {errors.password_confirm && (
                  <p className="text-red-400 text-xs">
                    {errors.password_confirm}
                  </p>
                )}
              </>
            )}

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-black border border-white/10 focus:border-yellow-400 outline-none"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password}</p>
            )}

            {/* CAPTCHA */}
            {captcha && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <img
                    src={captcha.captcha_image}
                    alt="captcha"
                    className="h-12 rounded"
                  />
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    className="text-xs text-yellow-400"
                  >
                    Refresh
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Enter CAPTCHA"
                  className="w-full p-3 rounded-lg bg-black border border-white/10 focus:border-yellow-400 outline-none"
                  onChange={(e) =>
                    setForm({ ...form, captcha_answer: e.target.value })
                  }
                />
                {errors.captcha && (
                  <p className="text-red-400 text-xs">{errors.captcha}</p>
                )}
              </div>
            )}

            <button className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:scale-[1.02] transition">
              {isLogin ? "Sign In" : "Register & Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
