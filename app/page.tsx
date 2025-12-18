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
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/signin");
    } else {
      const userData = JSON.parse(currentUser);
      // Fetch fresh data from database
      fetch(`/api/auth/profile?id=${userData.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            // Update localStorage with fresh data
            localStorage.setItem("currentUser", JSON.stringify(data.user));
          }
        })
        .catch(error => {
          console.error("Failed to fetch user profile:", error);
          // Fallback to localStorage data
          setUser(userData);
        });
    }
  }, [router]);

  // Load chat history when chat tab is active
  useEffect(() => {
    if (activeTab === "chat" && user) {
      fetch(`/api/chat?userId=${user.id}`)
        .then(res => res.json())
        .then(messages => {
          const formattedMessages = messages.map((msg: any) => ({
            role: msg.role === "model" ? "assistant" : msg.role,
            content: msg.content,
            timestamp: new Date(msg.createdAt),
          }));
          setChatMessages(formattedMessages);
        })
        .catch(error => {
          console.error("Failed to load chat history:", error);
        });
    }
  }, [activeTab, user]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/signin");
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoadingChat) return;

    const userMessage = { role: "user", content: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsLoadingChat(true);

    try {
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, content: userMessage.content }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = { role: "assistant", content: data.message, timestamp: new Date() };
        setChatMessages(prev => [...prev, aiMessage]);
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
    <div className="min-h-screen flex items-center justify-center neumorphism-flat p-8">
      <div className="text-black text-xl font-semibold">Loading your style profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Header */}
      <header className="neumorphism mx-6 mt-6 mb-4">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">👔</div>
              <div>
                <h1 className="text-2xl font-bold text-black">AI Stylist</h1>
                <p className="text-sm text-gray-600">Hey {user.name}! Let's style you up</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="neumorphism-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="neumorphism mx-6 mb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {[
              { id: "dashboard", name: "Dashboard", icon: "🏠" },
              { id: "profile", name: "Profile", icon: "👤" },
              { id: "chat", name: "AI Chat", icon: "🤖" },
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
                className={`px-4 py-3 whitespace-nowrap transition font-semibold ${
                  activeTab === tab.id
                    ? "neumorphism-pressed text-black"
                    : "neumorphism text-gray-700 hover:text-black"
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
        {/* Profile View */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="neumorphism p-8">
              <h2 className="text-3xl font-bold text-black mb-4">
                Your Profile 👤
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Manage your personal information and style preferences
              </p>

              {/* Profile Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="neumorphism p-6">
                  <h3 className="text-xl font-bold text-black mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Name:</span>
                      <span className="font-semibold text-black">{user.name || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Email:</span>
                      <span className="font-semibold text-black">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Age:</span>
                      <span className="font-semibold text-black">{user.age || "Not set"}</span>
                    </div>
                  </div>
                </div>

                <div className="neumorphism p-6">
                  <h3 className="text-xl font-bold text-black mb-4">Style Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Gender:</span>
                      <span className="font-semibold text-black capitalize">{user.gender || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Style:</span>
                      <span className="font-semibold text-black capitalize">
                        {(user.stylePreferences || []).length > 0 ? user.stylePreferences.join(", ") : "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Location:</span>
                      <span className="font-semibold text-black">{user.location || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Body Type:</span>
                      <span className="font-semibold text-black capitalize">{user.bodyType || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Height:</span>
                      <span className="font-semibold text-black">{user.height ? `${user.height} cm` : "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Weight:</span>
                      <span className="font-semibold text-black">{user.weight ? `${user.weight} kg` : "Not set"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="neumorphism-inset p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-black">Profile Completion</span>
                  <span className="text-lg font-bold text-black">
                    {(() => {
                      let completed = 1; // email is always there
                      if (user.name) completed++;
                      if (user.age) completed++;
                      if (user.gender) completed++;
                      if ((user.stylePreferences || []).length > 0) completed++;
                      if (user.location) completed++;
                      if (user.weight) completed++;
                      if (user.height) completed++;
                      if (user.bodyType) completed++;
                      return Math.round((completed / 9) * 100);
                    })()}%
                  </span>
                </div>
                <div className="w-full neumorphism-inset rounded-full h-6 mb-4">
                  <div
                    className="bg-black h-6 rounded-full transition-all duration-500"
                    style={{
                      width: `${(() => {
                        let completed = 1;
                        if (user.name) completed++;
                        if (user.age) completed++;
                        if (user.gender) completed++;
                        if ((user.stylePreferences || []).length > 0) completed++;
                        if (user.location) completed++;
                        if (user.weight) completed++;
                        if (user.height) completed++;
                        if (user.bodyType) completed++;
                        return (completed / 9) * 100;
                      })()}%`
                    }}
                  />
                </div>
                <div className="text-center">
                  <button
                    onClick={() => router.push("/profile")}
                    className="neumorphism-btn"
                  >
                    View Full Profile & Edit Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="space-y-6">
            <div className="neumorphism p-8">
              <h2 className="text-3xl font-bold text-black mb-4">
                AI Fashion Assistant 🤖
              </h2>
              <p className="text-gray-700 mb-6">
                Chat with your personal AI stylist for fashion advice, outfit recommendations, and style tips!
              </p>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto mb-4 neumorphism-inset p-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">💬</div>
                    <p>Start a conversation with your AI stylist!</p>
                    <p className="text-sm">Ask about outfit recommendations, color combinations, or fashion tips.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.role === "user"
                              ? "neumorphism-pressed text-black"
                              : "neumorphism text-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoadingChat && (
                      <div className="flex justify-start">
                        <div className="neumorphism px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about fashion, outfits, colors..."
                  className="flex-1 neumorphism-input px-4 py-2"
                  disabled={isLoadingChat}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoadingChat || !chatInput.trim()}
                  className="neumorphism-btn px-6 py-2 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="neumorphism p-8">
              <h2 className="text-3xl font-bold text-black mb-4">
                Welcome to Your AI Stylist ✨
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Your personal fashion assistant powered by AI. Get outfit recommendations,
                color combinations, washing instructions, and more!
              </p>

              {/* Time View Selector */}
              <div className="flex space-x-3 mb-6">
                {["weekly", "monthly", "yearly"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setTimeView(view)}
                    className={`px-6 py-2 rounded-full capitalize transition font-semibold ${
                      timeView === view
                        ? "neumorphism-pressed text-black"
                        : "neumorphism text-gray-700 hover:text-black"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="neumorphism p-6">
                  <div className="text-3xl mb-2">👕</div>
                  <div className="text-2xl font-bold text-black">24</div>
                  <div className="text-sm text-gray-600">Outfits Created</div>
                </div>
                <div className="neumorphism p-6">
                  <div className="text-3xl mb-2">🎨</div>
                  <div className="text-2xl font-bold text-black">12</div>
                  <div className="text-sm text-gray-600">Color Combos</div>
                </div>
                <div className="neumorphism p-6">
                  <div className="text-3xl mb-2">🧺</div>
                  <div className="text-2xl font-bold text-black">8</div>
                  <div className="text-sm text-gray-600">Items in Wash</div>
                </div>
                <div className="neumorphism p-6">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-2xl font-bold text-black">5</div>
                  <div className="text-sm text-gray-600">Give Away Items</div>
                </div>
              </div>
            </div>

            {/* Song-Based Recommendation */}
            <div className="neumorphism p-8">
              <h3 className="text-2xl font-bold text-black mb-4">
                🎵 Style Based on Your Music
              </h3>
              <p className="text-gray-700 mb-4">
                What are you listening to today?
              </p>
              <select
                value={selectedSong}
                onChange={(e) => setSelectedSong(e.target.value)}
                className="neumorphism-input w-full mb-4"
              >
                <option value="">Select your mood...</option>
                {songMoods.map((mood, idx) => (
                  <option key={idx} value={mood.song}>
                    {mood.song}
                  </option>
                ))}
              </select>
              {selectedSong && (
                <div className="neumorphism-inset p-4">
                  <p className="text-black font-semibold">
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
            <div className="neumorphism p-8">
              <h2 className="text-3xl font-bold text-black mb-4">
                Choose Your Situation 🎯
              </h2>
              <p className="text-gray-700 mb-6">
                Select what you're doing today and get personalized outfit choices
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {situations.map((situation) => (
                  <button
                    key={situation.id}
                    onClick={() => setSelectedSituation(situation.id)}
                    className={`p-6 rounded-xl transition font-semibold ${
                      selectedSituation === situation.id
                        ? "neumorphism-pressed text-black"
                        : "neumorphism text-gray-700 hover:text-black"
                    }`}
                  >
                    <div className="text-5xl mb-3">{situation.icon}</div>
                    <div className="text-xl font-semibold">{situation.name}</div>
                  </button>
                ))}
              </div>
              {selectedSituation && (
                <div className="mt-6 neumorphism-inset p-6">
                  <h3 className="text-xl font-bold text-black mb-2">
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
            <div className="neumorphism p-8">
              <h2 className="text-3xl font-bold text-black mb-4">
                Color Combinations 🎨
              </h2>
              <p className="text-gray-700 mb-6">
                Perfect monochrome color pairs for your wardrobe
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { primary: "#000000", secondary: "#ffffff", name: "Black & White" },
                  { primary: "#ffffff", secondary: "#000000", name: "White & Black" },
                  { primary: "#666666", secondary: "#ffffff", name: "Gray & White" },
                  { primary: "#ffffff", secondary: "#666666", name: "White & Gray" },
                ].map((combo, idx) => (
                  <div key={idx} className="neumorphism p-4">
                    <div className="flex h-32 mb-4">
                      <div
                        className="flex-1 flex items-center justify-center font-bold"
                        style={{ backgroundColor: combo.primary, color: combo.secondary }}
                      >
                        Primary
                      </div>
                      <div
                        className="flex-1 flex items-center justify-center font-bold"
                        style={{ backgroundColor: combo.secondary, color: combo.primary }}
                      >
                        Secondary
                      </div>
                    </div>
                    <h3 className="font-bold text-black text-lg mb-2">{combo.name}</h3>
                    <div className="flex space-x-2">
                      <span className="text-sm text-gray-600">{combo.primary}</span>
                      <span className="text-sm text-gray-600">+</span>
                      <span className="text-sm text-gray-600">{combo.secondary}</span>
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
            <div className="neumorphism p-8">
              <h2 className="text-3xl font-bold text-black mb-4">
                Outfit Recommendations 👕
              </h2>
              <p className="text-gray-700 mb-6">
                AI-powered suggestions based on trending news and weather
              </p>
              <div className="space-y-4">
                {Object.entries(outfitRecommendations).map(([key, rec]) => (
                  <div
                    key={key}
                    className="neumorphism p-6 cursor-pointer"
                    onClick={() => setSelectedOutfit(rec)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-black capitalize mb-2">
                          {key} Outfit
                        </h3>
                        <p className="text-lg text-gray-800 mb-3">{rec.outfit}</p>
                        <div className="flex space-x-2 mb-3">
                          {["#000000", "#ffffff", "#666666"].slice(0, rec.colors.length).map((color, idx) => (
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
                      <button className="neumorphism-btn">
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
            <div className="neumorphism p-8">
              <h2 className="text-3xl font-bold text-black mb-4">
                Washing Instructions 🧺
              </h2>
              <p className="text-gray-700 mb-6">
                Proper care instructions for your garments
              </p>
              <div className="space-y-4">
                {washingInstructions.map((item, idx) => (
                  <div key={idx} className="neumorphism-inset p-6">
                    <h3 className="text-xl font-bold text-black mb-3">
                      {item.item}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🌡️</span>
                        <div>
                          <div className="text-sm text-gray-600">Temperature</div>
                          <div className="font-semibold text-black">{item.temp}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🔄</span>
                        <div>
                          <div className="text-sm text-gray-600">Cycle</div>
                          <div className="font-semibold text-black">{item.cycle}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">💡</span>
                        <div>
                          <div className="text-sm text-gray-600">Tips</div>
                          <div className="font-semibold text-black text-sm">{item.tips}</div>
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
            <div className="neumorphism p-8">
              <h2 className="text-3xl font-bold text-black mb-4">
                Wearing Recommendations 💡
              </h2>
              <p className="text-gray-700 mb-6">
                Expert tips on how to wear your outfits
              </p>
              <div className="space-y-4">
                <div className="neumorphism-inset p-6">
                  <h3 className="font-bold text-black text-lg mb-2">
                    Layering Technique
                  </h3>
                  <p className="text-gray-700">
                    Create depth with monochromatic layers. Start with lighter shades underneath and gradually go darker on outer layers.
                  </p>
                </div>
                <div className="neumorphism-inset p-6">
                  <h3 className="font-bold text-black text-lg mb-2">
                    Accessorizing with Monochrome
                  </h3>
                  <p className="text-gray-700">
                    Mix different shades of black, white, and gray for sophisticated looks. Add metallic accents for elegance.
                  </p>
                </div>
                <div className="neumorphism-inset p-6">
                  <h3 className="font-bold text-black text-lg mb-2">
                    Seasonal Wearing
                  </h3>
                  <p className="text-gray-700">
                    Monochrome works year-round. Lighter grays for spring/summer, darker tones for fall/winter.
                  </p>
                </div>
                <div className="neumorphism-inset p-6">
                  <h3 className="font-bold text-black text-lg mb-2">
                    Fit and Proportion
                  </h3>
                  <p className="text-gray-700">
                    Ensure your pieces fit well. Monochrome styling requires precision for the best visual impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Give Away Tab */}
        {activeTab === "giveaway" && (
          <div className="space-y-6">
            <div className="neumorphism p-8">
              <h2 className="text-3xl font-bold text-black mb-4">
                Give Away List 📦
              </h2>
              <p className="text-gray-700 mb-6">
                Items AI suggests you should consider donating or giving away
              </p>
              <div className="space-y-4">
                {[
                  {
                    item: "Old Black Jacket",
                    reason: "Not worn in 18 months",
                    condition: "Good",
                    suggestion: "Donate to charity",
                  },
                  {
                    item: "Gray Shirt (Size M)",
                    reason: "Doesn't fit current size",
                    condition: "Excellent",
                    suggestion: "Give to friend or resell",
                  },
                  {
                    item: "Worn Out White Shoes",
                    reason: "Heavily worn, outdated style",
                    condition: "Poor",
                    suggestion: "Recycle or dispose",
                  },
                  {
                    item: "Black T-shirt (Stained)",
                    reason: "Permanent stains",
                    condition: "Fair",
                    suggestion: "Use as cleaning cloth",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="neumorphism p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-black mb-2">
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
                        <button className="neumorphism-btn text-sm">
                          Keep
                        </button>
                        <button className="neumorphism-btn text-sm">
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
            <div className="neumorphism p-8">
              <h2 className="text-3xl font-bold text-black mb-4">
                Your Style Recap 📊
              </h2>
              <p className="text-gray-700 mb-6">
                Summary of your style journey with AI Stylist
              </p>

              {/* Time Period Selector */}
              <div className="flex space-x-3 mb-6">
                {["This Week", "This Month", "This Year"].map((period) => (
                  <button
                    key={period}
                    className="neumorphism-btn capitalize"
                  >
                    {period}
                  </button>
                ))}
              </div>

              {/* Recap Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="neumorphism p-6">
                  <h3 className="text-xl font-bold text-black mb-4">
                    Most Worn Colors
                  </h3>
                  <div className="space-y-3">
                    {["Black (#000000) - 45%", "White (#FFFFFF) - 30%", "Gray (#666666) - 25%"].map((color, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-full neumorphism-inset rounded-full h-4">
                          <div
                            className="bg-black h-4 rounded-full"
                            style={{ width: color.split("- ")[1] }}
                          />
                        </div>
                        <span className="text-sm text-gray-700 whitespace-nowrap">{color.split(" - ")[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neumorphism p-6">
                  <h3 className="text-xl font-bold text-black mb-4">
                    Top Situations
                  </h3>
                  <div className="space-y-2">
                    {["Casual Day - 12 times", "Work/Office - 8 times", "Date Night - 3 times"].map((sit, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 neumorphism-inset">
                        <span className="text-gray-800">{sit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="neumorphism p-6">
                  <h3 className="text-xl font-bold text-black mb-4">
                    Wardrobe Health
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Active Items</span>
                      <span className="font-bold text-black">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Need Washing</span>
                      <span className="font-bold text-black">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Suggested Giveaway</span>
                      <span className="font-bold text-black">5</span>
                    </div>
                  </div>
                </div>

                <div className="neumorphism p-6">
                  <h3 className="text-xl font-bold text-black mb-4">
                    Style Evolution
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Your style has evolved towards minimalist monochrome aesthetics.
                  </p>
                  <div className="text-sm text-gray-600">
                    <p>✨ Favorite combo: Black & White</p>
                    <p>📈 Style confidence: +35%</p>
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-black mb-4">
                  Achievements 🏆
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: "🎨", name: "Monochrome Master", desc: "Mastered black & white" },
                    { icon: "👕", name: "Style Explorer", desc: "Tried all situations" },
                    { icon: "♻️", name: "Eco Warrior", desc: "Gave away 5+ items" },
                    { icon: "📅", name: "Consistent", desc: "30-day streak" },
                  ].map((badge, idx) => (
                    <div key={idx} className="neumorphism p-4 text-center">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <div className="font-bold mb-1 text-black">{badge.name}</div>
                      <div className="text-xs text-gray-600">{badge.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="neumorphism mx-6 mt-12 mb-6">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-lg mb-2 text-black font-semibold">✨ AI Stylist - Your Personal Fashion Assistant</p>
          <p className="text-sm text-gray-600">
            Powered by AI • Monochrome Design • Made with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
