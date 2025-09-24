import React, { useState, useEffect, useContext } from "react";
import { isValidEmail } from "./validateEmail";
import { isValidName } from "./validateName";
import {
  updateProfile,
  updatePassword,
  updateNotifications,
  updatePreferences,
  deleteAccount as apiDeleteAccount,
} from "./api";
import { PreferencesContext } from "./PreferencesContext";

export default function UserSettings({ user, onUpdateUser }) {
  const { preferences, setPreferences } = useContext(PreferencesContext);

  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // Initialize preferences from user
  useEffect(() => {
    if (user) {
      setPreferences({
        theme: user.theme || "Light",
        currency: user.currency || "INR",
        emailNotifications: user.emailNotifications || false,
        smsNotifications: user.smsNotifications || false,
      });
    }
  }, [user, setPreferences]);

  // ---------------- Handlers ----------------

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email)) return setMessage("❌ Invalid email. Allowed: gmail, yahoo, hotmail, outlook");
    if (!isValidName(form.name)) return setMessage("❌ Name should only contain letters");

    try {
      await updateProfile(form.name, form.email);
      onUpdateUser({ ...user, name: form.name, email: form.email });
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return setMessage("❌ Passwords do not match");

    try {
      await updatePassword(passwordForm.oldPassword, passwordForm.newPassword);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("✅ Password updated successfully!");
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const handlePreferencesSave = async () => {
  try {
    await updatePreferences(preferences); // send the whole object
    setMessage("✅ Preferences saved");
  } catch (err) {
    setMessage("❌ " + err.message);
  }
};

  const handleNotificationsSave = async () => {
  try {
    const updated = await updateNotifications(preferences.emailNotifications, preferences.smsNotifications);
    setPreferences((prev) => ({ ...prev, ...updated.preferences })); // optional: sync context
    setMessage("✅ Notifications updated");
  } catch (err) {
    setMessage("❌ " + err.message);
  }
};


  const handleDeleteAccount = async () => {
  if (!window.confirm("⚠️ Are you sure you want to delete your account? This cannot be undone.")) return;

  try {
    await apiDeleteAccount(); // backend removes account + session

    // Clear frontend state/session
    onUpdateUser(null); 
    localStorage.clear(); // if you store token/preferences
    sessionStorage.clear();

    setMessage("✅ Account deleted successfully!");

    // Redirect immediately to login or homepage
    window.location.replace("/login"); 
  } catch (err) {
    setMessage("❌ " + err.message);
  }
};



  // ---------------- Render ----------------
  return (
    <div className="container mt-4">
      <h2 className="mb-4">⚙️ User Settings</h2>

      {message && (
        <div className={`alert ${message.includes("❌") ? "alert-danger" : "alert-success"}`}>
          {message}
        </div>
      )}

      {/* Tabs Navigation */}
      <ul className="nav nav-tabs">
        {["profile", "security", "notifications", "preferences", "account"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setMessage(""); // Clear message on tab switch
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* Tabs Content */}
      <div className="tab-content p-4 border border-top-0 rounded-bottom shadow-sm bg-dark text-light">
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit}>
            <h4>👤 Profile</h4>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        )}

        {activeTab === "security" && (
          <form onSubmit={handlePasswordSubmit}>
            <h4>🔒 Change Password</h4>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Old Password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />
            <button type="submit" className="btn btn-warning">Update Password</button>
          </form>
        )}

        {activeTab === "notifications" && (
          <div>
            <h4>🔔 Notifications</h4>
            <div className="form-check mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="emailNotifications"
                checked={preferences.emailNotifications || false}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="emailNotifications">Email Notifications</label>
            </div>
            <div className="form-check mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="smsNotifications"
                checked={preferences.smsNotifications || false}
                onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="smsNotifications">SMS Notifications</label>
            </div>
            <button className="btn btn-info" onClick={handleNotificationsSave}>Save Notifications</button>
          </div>
        )}

        {activeTab === "preferences" && (
          <div>
            <h4>⚡ Preferences</h4>
            <div className="mb-3">
              <label>Theme</label>
              <select
                className="form-select"
                value={preferences.theme || "Light"}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
              >
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            <div className="form-check mb-2">
      <input
        type="checkbox"
        className="form-check-input"
        id="showTips"
        checked={preferences.showTips || false}
        onChange={(e) => setPreferences({ ...preferences, showTips: e.target.checked })}
      />
      <label className="form-check-label" htmlFor="showTips">
        Show Tips and Hints
      </label>
    </div>

    <div className="form-check mb-2">
      <input
        type="checkbox"
        className="form-check-input"
        id="enableSounds"
        checked={preferences.enableSounds || false}
        onChange={(e) => setPreferences({ ...preferences, enableSounds: e.target.checked })}
      />
      <label className="form-check-label" htmlFor="enableSounds">
        Enable Sounds
      </label>
    </div>

    <div className="form-check mb-2">
      <input
        type="checkbox"
        className="form-check-input"
        id="compactView"
        checked={preferences.compactView || false}
        onChange={(e) => setPreferences({ ...preferences, compactView: e.target.checked })}
      />
      <label className="form-check-label" htmlFor="compactView">
        Use Compact View
      </label>
    </div>
            <button className="btn btn-info" onClick={handlePreferencesSave}>Save Preferences</button>
          </div>
        )}

        {activeTab === "account" && (
          <div>
            <h4>🗑️ Danger Zone</h4>
            <p>Deleting your account will remove all your data. This action cannot be undone.</p>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        )}
      </div>
    </div>
  );
}
