"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.error || "Sign in failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Background decorative elements */}
      <div className="absolute top-8 left-8 opacity-10">
        <div className="text-5xl animate-pulse">🛒</div>
      </div>
      <div className="absolute top-16 right-12 opacity-10">
        <div className="text-4xl animate-bounce" style={{ animationDelay: "0.5s" }}>👤</div>
      </div>
      <div className="absolute bottom-12 left-12 opacity-10">
        <div className="text-3xl animate-pulse" style={{ animationDelay: "1s" }}>🎨</div>
      </div>
      <div className="absolute bottom-8 right-8 opacity-10">
        <div className="text-6xl animate-bounce" style={{ animationDelay: "1.5s" }}>🛍️</div>
      </div>

      <div className="neumorphism p-10 max-w-lg w-full relative z-10">
        {/* Welcome animation */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-2xl animate-pulse">✨</div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">Continue your style journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-black mb-3 flex items-center">
              <span className="mr-2">📧</span>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="neumorphism-input w-full px-4 py-3 text-lg"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-3 flex items-center">
              <span className="mr-2">🔒</span>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neumorphism-input w-full pr-14 px-4 py-3 text-lg"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl hover:scale-110 transition-transform duration-200"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div className="neumorphism-inset p-4 text-red-600 text-center">
              <span className="font-semibold">❌ {error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="neumorphism-btn w-full py-4 text-lg font-semibold relative overflow-hidden group disabled:opacity-50"
          >
            <span className="relative z-10">
              {isLoading ? "Signing In..." : "Sign In to ShopSmart"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>
        </form>

        {/* Benefits section */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div className="neumorphism-inset p-3 rounded-lg text-center">
            <div className="text-2xl mb-1">🛍️</div>
            <div className="font-semibold text-black">Smart Shopping</div>
          </div>
          <div className="neumorphism-inset p-3 rounded-lg text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="font-semibold text-black">Style Tracking</div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">New to ShopSmart?</p>
          <a
            href="/signup"
            className="inline-block neumorphism-btn px-8 py-3 font-semibold hover:scale-105 transition-transform duration-200"
          >
            Create Your Account ✨
          </a>
        </div>
      </div>
    </div>
  );
}
