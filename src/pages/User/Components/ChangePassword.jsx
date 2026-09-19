// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Imported eye icons
// Ensure this path is correct for your project
import { setpassword } from "../../../api/authApi"; 

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // States to toggle password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validation 1: Check if passwords match
    if (formData.new_password !== formData.confirm_password) {
      setError("New Password and Confirm Password do not match.");
      return;
    }

    // Validation 2: Strong Password Policy
    // Must contain at least 8 characters, one uppercase, one number and one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    
    if (!passwordRegex.test(formData.new_password)) {
      setError("Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.");
      return;
    }

    setLoading(true);

    try {
      // API call
      await setpassword({
        new_password: formData.new_password,
        new_password_confirm: formData.confirm_password,
      });

      setSuccessMessage("Password updated successfully!");
      setFormData({ new_password: "", confirm_password: "" }); // Clear form
      setShowNewPassword(false); // Reset visibility
      setShowConfirmPassword(false);
      
    } catch (err) {
      console.error("Failed to change password:", err);
      const apiError = err?.message || "An error occurred while updating the password. Please try again.";
      setError(
        apiError.replace(/\b(?:password_confirm|new_password_confirm)\b/g, "Confirm password"),
      );
    } finally {
      setLoading(false);
    }
  };

  // Common input styles (added pr-10 to give space for the eye icon)
  const inputClass = "w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-eatpur-green-dark/40 focus:border-eatpur-green-dark transition-all duration-200";

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
      <h2 className="text-2xl font-bold text-eatpur-dark mb-2 text-center">
        Change Password
      </h2>
      <p className="text-gray-500 text-sm text-center mb-6">
        Please enter and confirm your new password below.
      </p>

      {/* Error & Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 text-center font-medium">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100 text-center font-medium">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-700 mb-1.5 font-medium">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="new_password"
              required
              placeholder="Enter new password"
              value={formData.new_password}
              onChange={handleInputChange}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1.5 font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              required
              placeholder="Confirm new password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-eatpur-green-dark text-white py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}