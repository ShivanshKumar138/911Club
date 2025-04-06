/*eslint-disable*/
import { useState } from "react";
import axios from "axios";
import { Domain } from "@/components/Config";

const BannerUpload = () => {
  // State management
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 0,
    active: true,
  });
  const [bannerImage, setBannerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Banner types based on your schema
  const bannerTypes = [
    "1ST_DEPOSIT",
    "2ND_DEPOSIT",
    "INVITATION_BONUS",
    "TEAM_COMMISSION",
    "WINNING_STREAK_BONUS",
    "ATTENDANCE_BONUS",
    "DAILY_SALARY_BONUS",
    "ADS_FUND",
    "HOLD_ADVANCE",
    "OFFICIAL_PREDICTION_CHANNEL",
    "LOOKING_FOR_AGENT",
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form to default state
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      order: 0,
      active: true,
    });
    setBannerImage(null);
    setImagePreview(null);
  };

  // Submit form to create banner
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerImage) {
      setError("Please select an image to upload");
      return;
    }

    // Create FormData object for file upload
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("order", formData.order);
    submitData.append("active", formData.active);
    submitData.append("bannerImage", bannerImage);

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(Domain + "/upload/banner", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Banner uploaded successfully!");
      resetForm();
    } catch (err) {
      setError(
        "Failed to upload banner: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Banner</h1>

      {/* Success message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Upload form */}
      <div className="bg-white shadow-md rounded p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Banner Type*
            </label>
            <select
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Banner Type</option>
              {bannerTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Banner Image*
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-40 mx-auto border rounded"
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold">Active</span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Banner"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerUpload;
