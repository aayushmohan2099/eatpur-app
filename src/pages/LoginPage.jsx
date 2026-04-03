import React, { useEffect, useState } from "react";
import { getCaptcha, loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [captcha, setCaptcha] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
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

    const payload = {
      ...form,
      captcha_id: captcha.captcha_id,
    };

    const res = await loginUser(payload);

    if (res.access) {
      localStorage.setItem("access", res.access);
      localStorage.setItem("refresh", res.refresh);
      navigate("/user/dashboard");
    } else {
      alert("Login failed");
      fetchCaptcha(); // refresh captcha
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] p-8 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl mb-6">Login</h2>

        <input
          type="text"
          placeholder="Username / Email"
          className="w-full mb-4 p-2 bg-black border"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-black border"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {captcha && (
          <>
            <img src={captcha.captcha_image} alt="captcha" className="mb-2" />
            <input
              type="text"
              placeholder="Enter CAPTCHA"
              className="w-full mb-4 p-2 bg-black border"
              onChange={(e) =>
                setForm({ ...form, captcha_answer: e.target.value })
              }
            />
          </>
        )}

        <button className="w-full bg-yellow-400 text-black py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
