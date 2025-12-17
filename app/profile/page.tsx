"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>({});
  const styleOptions = ["casual", "sporty", "formal", "streetwear", "chic", "minimalist", "bohemian", "classic", "edgy"];
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
            setEditedUser(data.user);
            // Update localStorage with fresh data
            localStorage.setItem("currentUser", JSON.stringify(data.user));
          }
        })
        .catch(error => {
          console.error("Failed to fetch user profile:", error);
          // Fallback to localStorage data
          setUser(userData);
          setEditedUser(userData);
        });
    }
  }, [router]);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setIsEditing(false);
      } else {
        alert("Failed to save profile: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center neumorphism-flat p-8" style={{ background: "var(--background)" }}>
      <div className="text-black text-xl font-semibold">Loading your profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Header */}
      <header className="neumorphism mx-6 mt-6 mb-4">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">👤</div>
              <div>
                <h1 className="text-2xl font-bold text-black">AI Stylist Profile</h1>
                <p className="text-sm text-gray-600">Personalize your style recommendations</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/")}
                className="neumorphism-btn"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="neumorphism p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-black">
              Personal Information 👤
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="neumorphism-btn"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="neumorphism-btn"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="neumorphism-btn"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* Personal Details */}
            <div className="neumorphism p-6">
              <h3 className="text-xl font-bold text-black mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.name || ""}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="neumorphism-input w-full"
                    />
                  ) : (
                    <p className="text-lg text-gray-800 neumorphism p-3">
                      {user.name || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (for weather-based style suggestions)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.location || ""}
                      onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                      className="neumorphism-input w-full"
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-lg text-gray-800 neumorphism p-3">
                      {user.location || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age: {isEditing ? editedUser.age || 25 : user.age || "Not provided"}
                  </label>
                  {isEditing ? (
                    <input
                      type="range"
                      min="18"
                      max="100"
                      value={editedUser.age || 25}
                      onChange={(e) => setEditedUser({ ...editedUser, age: parseInt(e.target.value) })}
                      className="w-full h-2 neumorphism-inset rounded-lg appearance-none cursor-pointer"
                    />
                  ) : (
                    <p className="text-lg text-gray-800 neumorphism p-3">
                      {user.age ? `${user.age} years old` : "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  {isEditing ? (
                    <div className="flex space-x-4">
                      {["Male", "Female", "Other"].map((g) => (
                        <label key={g} className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value={g.toLowerCase()}
                            checked={editedUser.gender === g.toLowerCase()}
                            onChange={(e) => setEditedUser({ ...editedUser, gender: e.target.value })}
                            className="mr-2"
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-lg text-gray-800 neumorphism p-3 capitalize">
                      {user.gender || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Physical Attributes */}
            <div className="neumorphism p-6">
              <h3 className="text-xl font-bold text-black mb-4">Physical Attributes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight: {isEditing ? `${editedUser.weight || 70} kg` : user.weight ? `${user.weight} kg` : "Not provided"}
                  </label>
                  {isEditing ? (
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={editedUser.weight || 70}
                      onChange={(e) => setEditedUser({ ...editedUser, weight: parseInt(e.target.value) })}
                      className="w-full h-2 neumorphism-inset rounded-lg appearance-none cursor-pointer"
                    />
                  ) : (
                    <p className="text-lg text-gray-800 neumorphism p-3">
                      {user.weight ? `${user.weight} kg` : "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height: {isEditing ? `${editedUser.height || 170} cm` : user.height ? `${user.height} cm` : "Not provided"}
                  </label>
                  {isEditing ? (
                    <input
                      type="range"
                      min="140"
                      max="220"
                      value={editedUser.height || 170}
                      onChange={(e) => setEditedUser({ ...editedUser, height: parseInt(e.target.value) })}
                      className="w-full h-2 neumorphism-inset rounded-lg appearance-none cursor-pointer"
                    />
                  ) : (
                    <p className="text-lg text-gray-800 neumorphism p-3">
                      {user.height ? `${user.height} cm` : "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Type
                  </label>
                  {isEditing ? (
                    <select
                      value={editedUser.bodyType || ""}
                      onChange={(e) => setEditedUser({ ...editedUser, bodyType: e.target.value })}
                      className="neumorphism-input w-full"
                    >
                      <option value="">Select body type...</option>
                      <option value="ectomorph">Ectomorph</option>
                      <option value="mesomorph">Mesomorph</option>
                      <option value="endomorph">Endomorph</option>
                    </select>
                  ) : (
                    <p className="text-lg text-gray-800 neumorphism p-3 capitalize">
                      {user.bodyType || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Style Preferences */}
            <div className="neumorphism p-6">
              <h3 className="text-xl font-bold text-black mb-4">Style Preferences</h3>
              {isEditing ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {styleOptions.map((style) => (
                    <label key={style} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(editedUser.stylePreferences || []).includes(style)}
                        onChange={(e) => {
                          const current = editedUser.stylePreferences || [];
                          if (e.target.checked) {
                            setEditedUser({ ...editedUser, stylePreferences: [...current, style] });
                          } else {
                            setEditedUser({ ...editedUser, stylePreferences: (current as string[]).filter((s: string) => s !== style) });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="capitalize">{style}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-gray-800 neumorphism p-3">
                  {(user.stylePreferences || []).length > 0 ? (user.stylePreferences as string[]).map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ") : "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="mt-8 pt-8 neumorphism-inset">
            <h3 className="text-xl font-bold text-black mb-4 px-6 pt-6">Account Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-6">
              <div className="neumorphism p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">📋</span>
                  <div>
                    <div className="font-bold text-black">Onboarding Status</div>
                    <div className="text-sm text-gray-600">Profile completion</div>
                  </div>
                </div>
                <div className={`text-lg font-semibold ${user.isOnboarded ? 'text-black' : 'text-gray-600'}`}>
                  {user.isOnboarded ? '✅ Completed' : '⏳ Pending'}
                </div>
              </div>

              <div className="neumorphism p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">📅</span>
                  <div>
                    <div className="font-bold text-black">Member Since</div>
                    <div className="text-sm text-gray-600">Account creation date</div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-black">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="neumorphism p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">🔄</span>
                  <div>
                    <div className="font-bold text-black">Last Updated</div>
                    <div className="text-sm text-gray-600">Profile last modified</div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-black">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion Indicator */}
          <div className="mt-8 neumorphism-inset p-6">
            <h3 className="text-xl font-bold text-black mb-4">Profile Completion</h3>
            <div className="neumorphism-inset p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-black">Overall Completion</span>
                <span className="text-lg font-bold text-black">
                  {(() => {
                    let completed = 1; // email is always there
                    if (user.name) completed++;
                    if (user.age) completed++;
                    if (user.gender) completed++;
                    if (user.weight) completed++;
                    if (user.height) completed++;
                    if (user.bodyType) completed++;
                    if ((user.stylePreferences || []).length > 0) completed++;
                    if (user.location) completed++;
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
                      if (user.weight) completed++;
                      if (user.height) completed++;
                      if (user.bodyType) completed++;
                      if ((user.stylePreferences || []).length > 0) completed++;
                      if (user.location) completed++;
                      return (completed / 9) * 100;
                    })()}%`
                  }}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className={`flex items-center space-x-2 ${user.name ? 'text-black' : 'text-gray-400'}`}>
                  <span>{user.name ? '✓' : '○'}</span>
                  <span>Name</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.age ? 'text-black' : 'text-gray-400'}`}>
                  <span>{user.age ? '✓' : '○'}</span>
                  <span>Age</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.gender ? 'text-black' : 'text-gray-400'}`}>
                  <span>{user.gender ? '✓' : '○'}</span>
                  <span>Gender</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.weight ? 'text-black' : 'text-gray-400'}`}>
                  <span>{user.weight ? '✓' : '○'}</span>
                  <span>Weight</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.height ? 'text-black' : 'text-gray-400'}`}>
                  <span>{user.height ? '✓' : '○'}</span>
                  <span>Height</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.bodyType ? 'text-black' : 'text-gray-400'}`}>
                  <span>{user.bodyType ? '✓' : '○'}</span>
                  <span>Body Type</span>
                </div>
                <div className={`flex items-center space-x-2 ${(user.stylePreferences || []).length > 0 ? 'text-black' : 'text-gray-400'}`}>
                  <span>{(user.stylePreferences || []).length > 0 ? '✓' : '○'}</span>
                  <span>Style Preferences</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.location ? 'text-black' : 'text-gray-400'}`}>
                  <span>{user.location ? '✓' : '○'}</span>
                  <span>Location</span>
                </div>
                <div className="flex items-center space-x-2 text-black">
                  <span>✓</span>
                  <span>Email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
