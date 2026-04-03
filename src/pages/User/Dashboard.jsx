import React, { useEffect, useState } from "react";
import { getMe } from "../../api/authApi";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");
      const data = await getMe(token);
      setUser(data);
    };

    fetchUser();
  }, []);

  if (!user) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl mb-4">Welcome 👋</h1>

      <div className="bg-[#111] p-6 rounded-xl">
        <p>
          <b>Username:</b> {user.username}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Mobile:</b> {user.mobile}
        </p>
      </div>
    </div>
  );
}
