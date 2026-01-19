"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        setError(data.error || "Sign up failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
      {/* Sidebar */}
      <div className="w-full md:w-1/2 lg:w-1/3 neumorphism p-10 flex flex-col justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-6 left-10 opacity-10">
          <div className="text-6xl animate-pulse">🛍️</div>
        </div>
        <div className="absolute top-20 right-8 opacity-10">
          <div className="text-4xl animate-bounce" style={{ animationDelay: "0.7s" }}>👕</div>
        </div>
        <div className="absolute bottom-16 left-16 opacity-10">
          <div className="text-5xl animate-pulse" style={{ animationDelay: "1.2s" }}>💼</div>
        </div>
        <div className="absolute bottom-6 right-10 opacity-10">
          <div className="text-3xl animate-bounce" style={{ animationDelay: "1.8s" }}>✨</div>
        </div>

        <div className="relative z-10">
        {/* Welcome animation */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-2xl animate-pulse">🎉</div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent mb-2">
            Join ShopSmart
          </h1>
          <p className="text-gray-600 text-lg">Start your style journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-black mb-3 flex items-center">
              <span className="mr-2">👤</span>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="neumorphism-input w-full px-4 py-3 text-lg"
              placeholder="Your full name"
              required
            />
          </div>
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
                placeholder="Create a strong password"
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
          <div>
            <label className="block text-sm font-semibold text-black mb-3 flex items-center">
              <span className="mr-2">🔐</span>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="neumorphism-input w-full pr-14 px-4 py-3 text-lg"
                placeholder="Confirm your password"
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

          {success && (
            <div className="neumorphism-inset p-4 text-green-600 text-center">
              <span className="font-semibold">✅ Account created successfully! Redirecting to sign in...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || success}
            className="neumorphism-btn w-full py-4 text-lg font-semibold relative overflow-hidden group disabled:opacity-50"
          >
            <span className="relative z-10">
              {isLoading ? "Creating Account..." : success ? "Account Created!" : "Create Your Account ✨"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>
        </form>

        {/* Benefits section */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div className="neumorphism-inset p-3 rounded-lg text-center">
            <div className="text-2xl mb-1">🎨</div>
            <div className="font-semibold text-black">Style Discovery</div>
          </div>
          <div className="neumorphism-inset p-3 rounded-lg text-center">
            <div className="text-2xl mb-1">🧺</div>
            <div className="font-semibold text-black">Care Tips</div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Already have an account?</p>
          <a
            href="/signin"
            className="inline-block neumorphism-btn px-8 py-3 font-semibold hover:scale-105 transition-transform duration-200"
          >
            Welcome Back 👋
          </a>
        </div>
        </div>
      </div>

      {/* Right side content */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/3 items-center justify-center p-10">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">🛍️</div>
          <h2 className="text-4xl font-bold text-black mb-4">Join ShopSmart</h2>
          <p className="text-xl text-gray-600 mb-8">Start your personalized shopping journey with AI-powered recommendations</p>
          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="neumorphism p-6">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-lg font-bold text-black mb-2">Style Discovery</h3>
              <p className="text-gray-600">Find your perfect style with personalized recommendations</p>
            </div>
            <div className="neumorphism p-6">
              <div className="text-3xl mb-3">🛒</div>
              <h3 className="text-lg font-bold text-black mb-2">Smart Shopping</h3>
              <p className="text-gray-600">Get the best deals and product comparisons</p>
            </div>
            <div className="neumorphism p-6">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-black mb-2">Style Analytics</h3>
              <p className="text-gray-600">Track your fashion preferences and trends</p>
            </div>
            <div className="neumorphism p-6">
              <div className="text-3xl mb-3">🧺</div>
              <h3 className="text-lg font-bold text-black mb-2">Care Tips</h3>
              <p className="text-gray-600">Learn how to maintain your wardrobe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
