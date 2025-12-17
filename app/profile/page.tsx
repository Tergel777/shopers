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
      setUser(userData);
      setEditedUser(userData);
    }
  }, [router]);

  const handleSave = () => {
    // In a real app, you'd make an API call to update the user
    localStorage.setItem("currentUser", JSON.stringify(editedUser));
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B4513 0%, #F5F5DC 100%)" }}>
      <div className="text-white text-xl">Loading your profile...</div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FAF0E6 0%, #F5DEB3 100%)" }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">👤</div>
              <div>
                <h1 className="text-2xl font-bold">AI Stylist Profile</h1>
                <p className="text-sm text-amber-200">Personalize your style recommendations</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/")}
                className="bg-white text-amber-900 px-5 py-2 rounded-full hover:bg-amber-100 transition font-semibold"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-amber-900">
              Personal Information 👤
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-amber-900 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition font-semibold"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* Personal Details */}
            <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Personal Details</h3>
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
                      className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-900 focus:outline-none"
                    />
                  ) : (
                    <p className="text-lg text-gray-800 bg-white p-3 rounded-lg border-2 border-amber-200">
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
                      className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-900 focus:outline-none"
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-lg text-gray-800 bg-white p-3 rounded-lg border-2 border-amber-200">
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
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  ) : (
                    <p className="text-lg text-gray-800 bg-white p-3 rounded-lg border-2 border-amber-200">
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
                    <p className="text-lg text-gray-800 bg-white p-3 rounded-lg border-2 border-amber-200 capitalize">
                      {user.gender || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Physical Attributes */}
            <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Physical Attributes</h3>
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
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  ) : (
                    <p className="text-lg text-gray-800 bg-white p-3 rounded-lg border-2 border-amber-200">
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
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  ) : (
                    <p className="text-lg text-gray-800 bg-white p-3 rounded-lg border-2 border-amber-200">
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
                      className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-900 focus:outline-none"
                    >
                      <option value="">Select body type...</option>
                      <option value="ectomorph">Ectomorph</option>
                      <option value="mesomorph">Mesomorph</option>
                      <option value="endomorph">Endomorph</option>
                    </select>
                  ) : (
                    <p className="text-lg text-gray-800 bg-white p-3 rounded-lg border-2 border-amber-200 capitalize">
                      {user.bodyType || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Style Preferences */}
            <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Style Preferences</h3>
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
                <p className="text-lg text-gray-800 bg-white p-3 rounded-lg border-2 border-amber-200">
                  {(user.stylePreferences || []).length > 0 ? (user.stylePreferences as string[]).map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ") : "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Account Status */}
          <div className="mt-8 pt-8 border-t-2 border-amber-200">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Account Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">📋</span>
                  <div>
                    <div className="font-bold text-amber-900">Onboarding Status</div>
                    <div className="text-sm text-gray-600">Profile completion</div>
                  </div>
                </div>
                <div className={`text-lg font-semibold ${user.isOnboarded ? 'text-green-600' : 'text-orange-600'}`}>
                  {user.isOnboarded ? '✅ Completed' : '⏳ Pending'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">📅</span>
                  <div>
                    <div className="font-bold text-amber-900">Member Since</div>
                    <div className="text-sm text-gray-600">Account creation date</div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-amber-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">🔄</span>
                  <div>
                    <div className="font-bold text-amber-900">Last Updated</div>
                    <div className="text-sm text-gray-600">Profile last modified</div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-amber-900">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion Indicator */}
          <div className="mt-8 pt-8 border-t-2 border-amber-200">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Profile Completion</h3>
            <div className="bg-amber-50 p-6 rounded-xl border-2 border-amber-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-amber-900">Overall Completion</span>
                <span className="text-lg font-bold text-amber-900">
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
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-amber-900 h-4 rounded-full transition-all duration-500"
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
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className={`flex items-center space-x-2 ${user.name ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{user.name ? '✓' : '○'}</span>
                  <span>Name</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.age ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{user.age ? '✓' : '○'}</span>
                  <span>Age</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.gender ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{user.gender ? '✓' : '○'}</span>
                  <span>Gender</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.weight ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{user.weight ? '✓' : '○'}</span>
                  <span>Weight</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.height ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{user.height ? '✓' : '○'}</span>
                  <span>Height</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.bodyType ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{user.bodyType ? '✓' : '○'}</span>
                  <span>Body Type</span>
                </div>
                <div className={`flex items-center space-x-2 ${(user.stylePreferences || []).length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{(user.stylePreferences || []).length > 0 ? '✓' : '○'}</span>
                  <span>Style Preferences</span>
                </div>
                <div className={`flex items-center space-x-2 ${user.location ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{user.location ? '✓' : '○'}</span>
                  <span>Location</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
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
