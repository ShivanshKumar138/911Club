import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { domain } from "../../Components/config";

function UpdateImagesMain() {
  const [logo, setLogo] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [existingLogo, setExistingLogo] = useState(null);
  const [logoError, setLogoError] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newBanners, setNewBanners] = useState([]); // Change from single file to array
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedBannerId, setSelectedBannerId] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setSuccessMessage(""); // Clear success message

      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${domain}/api/site-settings`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const { logoUrl, banners } = response.data;
        setExistingLogo(logoUrl || "");
        setBannerImages(
          banners.map((banner) => ({
            id: banner.id,
            imageUrl: banner.imageUrl,
          }))
        );
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected logo file:", file);
    setLogo(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("Logo preview:", e.target.result);
      setExistingLogo(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (event, id) => {
    const files = Array.from(event.target.files);
    console.log("Selected banner files for id", id, ":", files);
    setNewBanners(files);
    setSelectedBannerId(id);
  };

  const updateLogo = async () => {
    setLoading(true);
    setSuccessMessage(""); // Clear success message

    if (!logo) {
      setLogoError("No logo selected.");
      setLoading(false);
      return;
    }

    const token = Cookies.get("token");
    const logoFormData = new FormData();
    logoFormData.append("file", logo);

    try {
      const response = await axios.post(
        `${domain}/api/site-settings/update-logo`,
        logoFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setExistingLogo(response.data.logoUrl);
      setLogoError("");
      setSuccessMessage("Logo updated successfully."); // Success message
    } catch (error) {
      setLogoError("Failed to update logo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateBanner = async () => {
    setLoading(true);
    setSuccessMessage(""); // Clear success message

    if (!newBanners.length || !selectedBannerId) {
      setBannerError("No banner selected or no banner ID.");
      setLoading(false);
      return;
    }

    const token = Cookies.get("token");
    const bannerFormData = new FormData();
    newBanners.forEach((file) => {
      bannerFormData.append("files", file); // 'files[]' matches the multer field name
    });

    try {
      const response = await axios.post(
        `${domain}/api/site-settings/update-banner/${selectedBannerId}`,
        bannerFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setBannerImages(
        response.data.bannerImages.map((banner) => ({
          id: banner._id,
          imageUrl: banner.imageUrl,
        }))
      );
      setNewBanners([]); // Clear selected files
      setSelectedBannerId(null);
      setBannerError("");
      setSuccessMessage("Banner updated successfully."); // Success message
    } catch (error) {
      setBannerError("Failed to update banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addBanner = async () => {
    setLoading(true);
    setSuccessMessage(""); // Clear success message

    if (!newBanners.length) {
      setBannerError("No banners selected.");
      setLoading(false);
      return;
    }

    const token = Cookies.get("token");
    const bannerFormData = new FormData();
    newBanners.forEach((file) => {
      bannerFormData.append("files", file); // 'files[]' matches the multer field name
    });

    try {
      const response = await axios.post(
        `${domain}/api/site-settings/add-banner-images`, // Updated URL to match the backend endpoint
        bannerFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setBannerImages(
        response.data.bannerImages.map((banner) => ({
          id: banner._id,
          imageUrl: banner.imageUrl,
        }))
      );
      setNewBanners([]); // Clear selected files
      setBannerError("");
      setSuccessMessage("Banner images added successfully."); // Success message
    } catch (error) {
      console.error('Error adding banner images:', error);
      setBannerError("Failed to add banner images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    setLoading(true);
    setSuccessMessage(""); // Clear success message

    const token = Cookies.get("token");

    try {
      await axios.delete(`${domain}/api/site-settings/delete-banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setBannerImages(bannerImages.filter((banner) => banner.id !== id));
      setBannerError("");
      setSuccessMessage("Banner deleted successfully."); // Success message
    } catch (error) {
      setBannerError("Failed to delete banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.subHeader}>Update Images</h2>
      {!loading && successMessage && (
        <p style={styles.success}>{successMessage}</p>
      )}

      <div style={styles.section}>
        <h3>Logo</h3>
        <div style={styles.logoWrapper}>
          <img src={existingLogo} alt="Existing Logo" style={styles.image} />
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={styles.fileInput}
          />
          <button onClick={updateLogo} style={styles.button}>
            Update Logo
          </button>
        </div>
        <p style={styles.error}>{logoError}</p>
      </div>
      <div style={styles.section}>
        <h3>Add New Banner</h3>
        <div style={styles.addBannerSection}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              console.log("New banner files selected:", event.target.files);
              setNewBanners(Array.from(event.target.files)); // Convert FileList to array
            }}
            style={styles.fileInput}
          />
          <button onClick={addBanner} style={styles.button}>
            Add Banner
          </button>
        </div>
        <p style={styles.error}>{bannerError}</p>
      </div>
      <div style={styles.section}>
        <h3>Banners</h3>
        {bannerImages.map((banner) => (
          <div key={banner.id} style={styles.bannerSection}>
            <div style={styles.imageWrapper}>
              <img src={banner.imageUrl} alt={`Banner`} style={styles.image} />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleBannerChange(event, banner.id)}
                style={styles.fileInput}
              />
              <button onClick={updateBanner} style={styles.updateButton}>
                Update
              </button>
              <button
                onClick={() => deleteBanner(banner.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
            <hr style={styles.separator} />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  subHeader: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
  },
  section: {
    margin: "20px 0",
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerSection: {
    margin: "20px 0",
  },
  imageWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: "150px",
    height: "auto",
    borderRadius: "8px",
  },
  fileInput: {
    marginLeft: "20px",
  },
  button: {
    marginLeft: "20px",
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  updateButton: {
    marginLeft: "20px",
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    marginLeft: "10px",
    padding: "8px 16px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  separator: {
    margin: "20px 0",
  },
  addBannerSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  success: {
    color: "green",
    textAlign: "center",
  },
};

export default UpdateImagesMain;
