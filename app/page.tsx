"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedSituation, setSelectedSituation] = useState("");
  const [selectedOutfit, setSelectedOutfit] = useState<any>(null);
  const [washList, setWashList] = useState<any[]>([]);
  const [giveAwayItems, setGiveAwayItems] = useState<any[]>([]);
  const [timeView, setTimeView] = useState("weekly");
  const [selectedSong, setSelectedSong] = useState("");
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/signin");
    } else {
      setUser(JSON.parse(currentUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/signin");
  };

  const situations = [
    { id: "casual", name: "Casual Day", icon: "👕" },
    { id: "work", name: "Work/Office", icon: "💼" },
    { id: "date", name: "Date Night", icon: "💝" },
    { id: "party", name: "Party", icon: "🎉" },
    { id: "gym", name: "Gym/Sports", icon: "💪" },
    { id: "formal", name: "Formal Event", icon: "🎩" },
  ];

  const colorCombinations = [
    { primary: "#8B4513", secondary: "#F5F5DC", name: "Brown & Beige" },
    { primary: "#6F4E37", secondary: "#FFFFFF", name: "Coffee & Cream" },
    { primary: "#D2691E", secondary: "#FAF0E6", name: "Chocolate & Linen" },
    { primary: "#A0522D", secondary: "#FFF8DC", name: "Sienna & Cornsilk" },
  ];

  const outfitRecommendations = {
    casual: {
      outfit: "Beige t-shirt with brown chinos",
      colors: ["#F5F5DC", "#8B4513"],
      weather: "Perfect for sunny 24°C day",
      trending: "Minimalist style is trending this week",
    },
    work: {
      outfit: "White shirt with brown blazer",
      colors: ["#FFFFFF", "#6F4E37"],
      weather: "Professional look for office",
      trending: "Earth tones popular in business wear",
    },
    date: {
      outfit: "Cream sweater with dark brown jeans",
      colors: ["#FFF8DC", "#654321"],
      weather: "Romantic evening style",
      trending: "Cozy elegant outfits trending",
    },
  };

  const washingInstructions = [
    {
      item: "Brown Cotton Shirt",
      temp: "30°C",
      cycle: "Gentle",
      tips: "Turn inside out, avoid bleach",
    },
    {
      item: "White Linen Pants",
      temp: "40°C",
      cycle: "Normal",
      tips: "Separate from colors, air dry",
    },
    {
      item: "Beige Wool Sweater",
      temp: "Cold",
      cycle: "Delicate",
      tips: "Hand wash preferred, lay flat to dry",
    },
  ];

  const songMoods = [
    { song: "Upbeat Pop", style: "Bright colors, casual fun" },
    { song: "Jazz Classic", style: "Sophisticated browns, elegant" },
    { song: "Rock Energy", style: "Bold contrasts, edgy" },
    { song: "Chill Acoustic", style: "Soft neutrals, comfortable" },
  ];

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B4513 0%, #F5F5DC 100%)" }}>
      <div className="text-white text-xl">Loading your style profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FAF0E6 0%, #F5DEB3 100%)" }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">👔</div>
              <div>
                <h1 className="text-2xl font-bold">AI Stylist</h1>
                <p className="text-sm text-amber-200">Hey {user.name}! Let's style you up</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-amber-900 px-5 py-2 rounded-full hover:bg-amber-100 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: "dashboard", name: "Dashboard", icon: "🏠" },
              { id: "situations", name: "Situations", icon: "🎯" },
              { id: "colors", name: "Colors", icon: "🎨" },
              { id: "outfits", name: "Outfits", icon: "👕" },
              { id: "wash", name: "Wash List", icon: "🧺" },
              { id: "wearing", name: "Wearing Tips", icon: "💡" },
              { id: "giveaway", name: "Give Away", icon: "📦" },
              { id: "recap", name: "Recap", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "border-b-4 border-amber-900 text-amber-900 font-semibold"
                    : "text-gray-600 hover:text-amber-800"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                Welcome to Your AI Stylist ✨
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Your personal fashion assistant powered by AI. Get outfit recommendations,
                color combinations, washing instructions, and more!
              </p>
              
              {/* Time View Selector */}
              <div className="flex space-x-3 mb-6">
                {["weekly", "monthly", "yearly"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setTimeView(view)}
                    className={`px-6 py-2 rounded-full capitalize transition ${
                      timeView === view
                        ? "bg-amber-900 text-white"
                        : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-6 rounded-xl border-2 border-amber-200">
                  <div className="text-3xl mb-2">👕</div>
                  <div className="text-2xl font-bold text-amber-900">24</div>
                  <div className="text-sm text-gray-600">Outfits Created</div>
                </div>
                <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-6 rounded-xl border-2 border-amber-200">
                  <div className="text-3xl mb-2">🎨</div>
                  <div className="text-2xl font-bold text-amber-900">12</div>
                  <div className="text-sm text-gray-600">Color Combos</div>
                </div>
                <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-6 rounded-xl border-2 border-amber-200">
                  <div className="text-3xl mb-2">🧺</div>
                  <div className="text-2xl font-bold text-amber-900">8</div>
                  <div className="text-sm text-gray-600">Items in Wash</div>
                </div>
                <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-6 rounded-xl border-2 border-amber-200">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-2xl font-bold text-amber-900">5</div>
                  <div className="text-sm text-gray-600">Give Away Items</div>
                </div>
              </div>
            </div>

            {/* Song-Based Recommendation */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">
                🎵 Style Based on Your Music
              </h3>
              <p className="text-gray-600 mb-4">
                What are you listening to today?
              </p>
              <select
                value={selectedSong}
                onChange={(e) => setSelectedSong(e.target.value)}
                className="w-full p-3 border-2 border-amber-200 rounded-lg mb-4 focus:border-amber-900 focus:outline-none"
              >
                <option value="">Select your mood...</option>
                {songMoods.map((mood, idx) => (
                  <option key={idx} value={mood.song}>
                    {mood.song}
                  </option>
                ))}
              </select>
              {selectedSong && (
                <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
                  <p className="text-amber-900 font-semibold">
                    Style Recommendation: {songMoods.find(m => m.song === selectedSong)?.style}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Situations Tab */}
        {activeTab === "situations" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                Choose Your Situation 🎯
              </h2>
              <p className="text-gray-600 mb-6">
                Select what you're doing today and get personalized outfit choices
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {situations.map((situation) => (
                  <button
                    key={situation.id}
                    onClick={() => setSelectedSituation(situation.id)}
                    className={`p-6 rounded-xl border-3 transition transform hover:scale-105 ${
                      selectedSituation === situation.id
                        ? "bg-amber-900 text-white border-amber-900 shadow-2xl"
                        : "bg-white border-amber-200 text-amber-900 hover:border-amber-400"
                    }`}
                  >
                    <div className="text-5xl mb-3">{situation.icon}</div>
                    <div className="text-xl font-semibold">{situation.name}</div>
                  </button>
                ))}
              </div>
              {selectedSituation && (
                <div className="mt-6 bg-amber-50 p-6 rounded-xl border-2 border-amber-200">
                  <h3 className="text-xl font-bold text-amber-900 mb-2">
                    Selected: {situations.find(s => s.id === selectedSituation)?.name}
                  </h3>
                  <p className="text-gray-700">
                    Great choice! Check the Outfits tab for recommendations.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === "colors" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                Color Combinations 🎨
              </h2>
              <p className="text-gray-600 mb-6">
                Perfect brown and neutral color pairs for your wardrobe
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {colorCombinations.map((combo, idx) => (
                  <div
                    key={idx}
                    className="border-3 border-amber-200 rounded-xl overflow-hidden hover:shadow-2xl transition"
                  >
                    <div className="flex h-32">
                      <div
                        className="flex-1 flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: combo.primary }}
                      >
                        Primary
                      </div>
                      <div
                        className="flex-1 flex items-center justify-center text-gray-800 font-bold"
                        style={{ backgroundColor: combo.secondary }}
                      >
                        Secondary
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50">
                      <h3 className="font-bold text-amber-900 text-lg">{combo.name}</h3>
                      <div className="flex space-x-2 mt-2">
                        <span className="text-sm text-gray-600">{combo.primary}</span>
                        <span className="text-sm text-gray-600">+</span>
                        <span className="text-sm text-gray-600">{combo.secondary}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Outfits Tab */}
        {activeTab === "outfits" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                Outfit Recommendations 👕
              </h2>
              <p className="text-gray-600 mb-6">
                AI-powered suggestions based on trending news and weather
              </p>
              <div className="space-y-4">
                {Object.entries(outfitRecommendations).map(([key, rec]) => (
                  <div
                    key={key}
                    className="border-2 border-amber-200 rounded-xl p-6 hover:border-amber-400 transition cursor-pointer"
                    onClick={() => setSelectedOutfit(rec)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-amber-900 capitalize mb-2">
                          {key} Outfit
                        </h3>
                        <p className="text-lg text-gray-800 mb-3">{rec.outfit}</p>
                        <div className="flex space-x-2 mb-3">
                          {rec.colors.map((color, idx) => (
                            <div
                              key={idx}
                              className="w-12 h-12 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>☀️ {rec.weather}</p>
                          <p>📰 {rec.trending}</p>
                        </div>
                      </div>
                      <button className="bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition">
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wash List Tab */}
        {activeTab === "wash" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                Washing Instructions 🧺
              </h2>
              <p className="text-gray-600 mb-6">
                Proper care instructions for your garments
              </p>
              <div className="space-y-4">
                {washingInstructions.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-bold text-amber-900 mb-3">
                      {item.item}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🌡️</span>
                        <div>
                          <div className="text-sm text-gray-600">Temperature</div>
                          <div className="font-semibold text-amber-900">{item.temp}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🔄</span>
                        <div>
                          <div className="text-sm text-gray-600">Cycle</div>
                          <div className="font-semibold text-amber-900">{item.cycle}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">💡</span>
                        <div>
                          <div className="text-sm text-gray-600">Tips</div>
                          <div className="font-semibold text-amber-900 text-sm">{item.tips}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wearing Tips Tab */}
        {activeTab === "wearing" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                Wearing Recommendations 💡
              </h2>
              <p className="text-gray-600 mb-6">
                Expert tips on how to wear your outfits
              </p>
              <div className="space-y-4">
                <div className="bg-amber-50 border-l-4 border-amber-900 p-6 rounded-lg">
                  <h3 className="font-bold text-amber-900 text-lg mb-2">
                    Layering Technique
                  </h3>
                  <p className="text-gray-700">
                    For brown tones, start with lighter shades underneath and gradually go darker on outer layers. This creates depth and visual interest.
                  </p>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-900 p-6 rounded-lg">
                  <h3 className="font-bold text-amber-900 text-lg mb-2">
                    Accessorizing with Browns
                  </h3>
                  <p className="text-gray-700">
                    Brown leather accessories (belts, shoes, bags) should match in tone. Mix warm browns with gold accessories for an elevated look.
                  </p>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-900 p-6 rounded-lg">
                  <h3 className="font-bold text-amber-900 text-lg mb-2">
                    Seasonal Wearing
                  </h3>
                  <p className="text-gray-700">
                    Lighter browns and beiges work great for spring/summer. Darker chocolate and coffee tones are perfect for fall/winter wardrobes.
                  </p>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-900 p-6 rounded-lg">
                  <h3 className="font-bold text-amber-900 text-lg mb-2">
                    Fit and Proportion
                  </h3>
                  <p className="text-gray-700">
                    Ensure your brown pieces fit well. Oversized brown can look sloppy, while well-fitted brown pieces appear sophisticated and intentional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Give Away Tab */}
        {activeTab === "giveaway" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                Give Away List 📦
              </h2>
              <p className="text-gray-600 mb-6">
                Items AI suggests you should consider donating or giving away
              </p>
              <div className="space-y-4">
                {[
                  {
                    item: "Old Brown Jacket",
                    reason: "Not worn in 18 months",
                    condition: "Good",
                    suggestion: "Donate to charity",
                  },
                  {
                    item: "Beige Shirt (Size M)",
                    reason: "Doesn't fit current size",
                    condition: "Excellent",
                    suggestion: "Give to friend or resell",
                  },
                  {
                    item: "Worn Out Brown Shoes",
                    reason: "Heavily worn, outdated style",
                    condition: "Poor",
                    suggestion: "Recycle or dispose",
                  },
                  {
                    item: "White T-shirt (Stained)",
                    reason: "Permanent stains",
                    condition: "Fair",
                    suggestion: "Use as cleaning cloth",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-amber-200 rounded-xl p-6 hover:border-amber-400 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-amber-900 mb-2">
                          {item.item}
                        </h3>
                        <div className="space-y-1 text-gray-700">
                          <p className="text-sm">
                            <span className="font-semibold">Reason:</span> {item.reason}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">Condition:</span> {item.condition}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">Suggestion:</span> {item.suggestion}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
                          Keep
                        </button>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recap Tab */}
        {activeTab === "recap" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                Your Style Recap 📊
              </h2>
              <p className="text-gray-600 mb-6">
                Summary of your style journey with AI Stylist
              </p>

              {/* Time Period Selector */}
              <div className="flex space-x-3 mb-6">
                {["This Week", "This Month", "This Year"].map((period) => (
                  <button
                    key={period}
                    className="px-6 py-2 bg-amber-100 text-amber-900 rounded-full hover:bg-amber-200 transition"
                  >
                    {period}
                  </button>
                ))}
              </div>

              {/* Recap Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-amber-900 mb-4">
                    Most Worn Colors
                  </h3>
                  <div className="space-y-3">
                    {["Brown (#8B4513) - 45%", "White (#FFFFFF) - 30%", "Beige (#F5F5DC) - 25%"].map((color, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-amber-900 h-3 rounded-full"
                            style={{ width: color.split("- ")[1] }}
                          />
                        </div>
                        <span className="text-sm text-gray-700 whitespace-nowrap">{color.split(" - ")[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-amber-900 mb-4">
                    Top Situations
                  </h3>
                  <div className="space-y-2">
                    {["Casual Day - 12 times", "Work/Office - 8 times", "Date Night - 3 times"].map((sit, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-800">{sit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-amber-900 mb-4">
                    Wardrobe Health
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Active Items</span>
                      <span className="font-bold text-amber-900">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Need Washing</span>
                      <span className="font-bold text-amber-900">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Suggested Giveaway</span>
                      <span className="font-bold text-amber-900">5</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-amber-900 mb-4">
                    Style Evolution
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Your style has evolved towards more minimalist and earth-tone aesthetics.
                  </p>
                  <div className="text-sm text-gray-600">
                    <p>✨ Favorite combo: Brown & White</p>
                    <p>📈 Style confidence: +35%</p>
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-amber-900 mb-4">
                  Achievements 🏆
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: "🎨", name: "Color Master", desc: "Used 10+ color combos" },
                    { icon: "👕", name: "Style Explorer", desc: "Tried all situations" },
                    { icon: "♻️", name: "Eco Warrior", desc: "Gave away 5+ items" },
                    { icon: "📅", name: "Consistent", desc: "30-day streak" },
                  ].map((badge, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-900 text-white p-4 rounded-xl text-center hover:scale-105 transition transform"
                    >
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <div className="font-bold mb-1">{badge.name}</div>
                      <div className="text-xs opacity-90">{badge.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg mb-2">✨ AI Stylist - Your Personal Fashion Assistant</p>
          <p className="text-sm text-amber-200">
            Powered by AI • Brown & White Theme • Made with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
