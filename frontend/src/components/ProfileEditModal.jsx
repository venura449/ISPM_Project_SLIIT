import { useState } from "react";
import { toast } from "react-toastify";

const ProfileEditModal = ({ user, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Failed to update profile", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      toast.success("Profile updated successfully! 🎉", {
        position: "top-right",
        autoClose: 2500,
      });
      onUpdate(data.user);
      onClose();
    } catch (err) {
      toast.error("Connection error: " + err.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/40 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 p-6 border-b border-slate-700/40 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-sm flex items-center justify-between">
          <div>
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Edit Profile
            </h2>
            <p
              className="text-slate-400 text-sm mt-1"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              update your personal information
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label
              className="text-xs text-slate-600 uppercase tracking-wider mb-2 block"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your full name"
              className="w-full bg-slate-900/60 text-cyan-50 rounded-lg px-4 py-3 text-sm outline-none border border-slate-700/40 focus:border-cyan-400/60 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label
              className="text-xs text-slate-600 uppercase tracking-wider mb-2 block"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={true}
              className="w-full bg-slate-900/40 text-slate-500 rounded-lg px-4 py-3 text-sm outline-none border border-slate-700/40 cursor-not-allowed"
            />
            <p
              className="text-xs text-slate-600 mt-1"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Email cannot be changed
            </p>
          </div>

          {/* Phone Field */}
          <div>
            <label
              className="text-xs text-slate-600 uppercase tracking-wider mb-2 block"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              placeholder="+94 71 234 5678"
              className="w-full bg-slate-900/60 text-cyan-50 rounded-lg px-4 py-3 text-sm outline-none border border-slate-700/40 focus:border-cyan-400/60 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Address Field */}
          <div>
            <label
              className="text-xs text-slate-600 uppercase tracking-wider mb-2 block"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
              placeholder="Street address, city, postal code"
              rows="3"
              className="w-full bg-slate-900/60 text-cyan-50 rounded-lg px-4 py-3 text-sm outline-none border border-slate-700/40 focus:border-cyan-400/60 transition-colors resize-none disabled:opacity-50"
            />
          </div>

          {/* Info Message */}
          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <p
              className="text-xs text-cyan-300"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              ℹ All fields will be updated in real-time across your account.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-slate-700/40 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 text-xs uppercase tracking-[0.2em] text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-all duration-200 bg-slate-900/50 hover:bg-slate-800 disabled:opacity-50"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 text-xs uppercase tracking-[0.2em] text-slate-950 font-semibold rounded-lg transition-all duration-200 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
