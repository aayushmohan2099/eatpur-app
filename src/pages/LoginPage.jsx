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
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white opacity-70"></span> Username must be unique</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white opacity-70"></span> Enter a valid email (example@gmail.com)</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white opacity-70"></span> Mobile must be exactly 10 digits</li>
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
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white opacity-70"></span> Confirm password must match</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-white opacity-70"></span> Complete CAPTCHA to verify</li>
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
          {/* Toggle */}
          <div className="flex mb-8 bg-eatpur-white-warm p-1 rounded-xl overflow-hidden border border-black/5 shadow-inner">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                isLogin ? "bg-white text-eatpur-green-dark shadow-sm border border-black/5" : "text-eatpur-text-light hover:text-eatpur-dark"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                !isLogin ? "bg-white text-eatpur-green-dark shadow-sm border border-black/5" : "text-eatpur-text-light hover:text-eatpur-dark"
              }`}
            >
              Register
            </button>
          </div>

          <h2 className="text-3xl font-display text-eatpur-dark mb-8 text-center tracking-tight">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3.5 rounded-xl bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.username}</p>
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
                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.mobile}</p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3.5 rounded-xl bg-eatpur-white-warm border border-black/10 focus:border-eatpur-green-dark outline-none text-eatpur-dark placeholder:text-eatpur-text-light shadow-inner font-serif transition-colors"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
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
                      {errors.password_confirm}
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
                <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.password}</p>
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
                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium text-center">{errors.captcha}</p>
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
