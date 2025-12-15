"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    } else {
      router.push("/signin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/signin");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl">Welcome, {user.name}!</h1>
          <button
            onClick={handleLogout}
            className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 border border-red-600"
          >
            LOGOUT
          </button>
        </div>
        <p>You are now logged in and on the home page.</p>
      </div>
    </div>
  );
}
