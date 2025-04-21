import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProfile,
  updateProfileFarmer,
} from "../../Redux/Slices/farmerSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../Pages/Header";
import Footer from "../../Pages/Footer";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import AOS from "aos";

const UpdateProfileFarmer = () => {
  const [formData, setFormData] = useState({
    farmName: "",
    farmSize: "",
    location: {
      latitude: "",
      longitude: "",
      coordinates: [],
    },
    certifications: [],
  });
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    profile,
    loading: profileLoading,
    error,
  } = useSelector((state) => state.farmer);

  // Fetch profile on mount
  useEffect(() => {
    dispatch(getFarmerProfile());
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });
  }, [dispatch]);

  // Pre-fill form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        farmName: profile.farmName || "",
        farmSize: profile.farmSize ? profile.farmSize.toString() : "",
        location: {
          latitude: profile.location?.coordinates[1]?.toString() || "",
          longitude: profile.location?.coordinates[0]?.toString() || "",
          coordinates: profile.location?.coordinates || [],
        },
        certifications: profile.certifications || [],
      });
    }
  }, [profile]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 3000, position: "top-right" });
      dispatch({ type: "farmer/clearError" });
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "latitude" || name === "longitude") {
      const updatedLocation = {
        ...formData.location,
        [name]: value,
      };
      const { latitude, longitude } = updatedLocation;
      if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
        updatedLocation.coordinates = [
          parseFloat(longitude),
          parseFloat(latitude),
        ];
      } else {
        updatedLocation.coordinates = [];
      }
      setFormData({ ...formData, location: updatedLocation });
    } else if (name === "certifications") {
      setFormData({
        ...formData,
        certifications: value.split(",").map((cert) => cert.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
            ...prevData,
            location: {
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              coordinates: [longitude, latitude],
            },
          }));
          toast.success("Location fetched successfully!", {
            duration: 3000,
            position: "top-right",
          });
          setGeoLoading(false);
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Please allow location access to use this feature.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get location timed out.";
              break;
            default:
              errorMessage = "An error occurred while fetching location.";
          }
          toast.error(errorMessage, { duration: 3000, position: "top-right" });
          setGeoLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.farmName.trim()) {
      toast.error("Farm name is required.", {
        duration: 3000,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    const farmSize = parseFloat(formData.farmSize);
    if (isNaN(farmSize) || farmSize <= 0) {
      toast.error("Farm size must be a positive number.", {
        duration: 3000,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    const { latitude, longitude, coordinates } = formData.location;
    if (
      !latitude ||
      !longitude ||
      coordinates.length !== 2 ||
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      toast.error(
        "Please provide valid latitude (-90 to 90) and longitude (-180 to 180).",
        {
          duration: 3000,
          position: "top-right",
        }
      );
      setLoading(false);
      return;
    }

    const formattedData = {
      farmName: formData.farmName,
      farmSize,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      certifications: formData.certifications.filter((cert) => cert.trim()),
    };

    try {
      await dispatch(updateProfileFarmer(formattedData)).unwrap();
      toast.success("Profile updated successfully!", {
        duration: 3000,
        position: "top-right",
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error(error || "Failed to update profile", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header className="w-full" />
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div
          className="relative max-w-md w-full bg-white shadow-lg rounded-lg p-8 transition-all duration-300 transform hover:shadow-xl"
          data-aos="fade-up"
        >
          <button
            className="absolute left-4 top-4 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
            onClick={() => navigate("/dashboard")}
            aria-label="Go back"
          >
            <FaRegArrowAltCircleLeft className="text-2xl" />
          </button>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Update Profile
          </h2>
          {profileLoading ? (
            <div className="text-center text-gray-600">Loading profile...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="farmName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Farm Name
                </label>
                <input
                  type="text"
                  id="farmName"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="Enter Farm Name (e.g., Sunny Acres)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="farmSize"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Farm Size (acres)
                </label>
                <input
                  type="number"
                  id="farmSize"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  placeholder="Enter Farm Size (e.g., 10)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.location.latitude}
                  onChange={handleChange}
                  placeholder="Enter Latitude (e.g., 40.7128)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                  step="any"
                />
              </div>
              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.location.longitude}
                  onChange={handleChange}
                  placeholder="Enter Longitude (e.g., -74.0060)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                  step="any"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${
                    geoLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#004526] hover:bg-[#004540]"
                  }`}
                  disabled={geoLoading}
                >
                  {geoLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Fetching Location...
                    </span>
                  ) : (
                    "Get Current Location"
                  )}
                </button>
              </div>
              <div>
                <label
                  htmlFor="certifications"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Certifications (comma-separated, optional)
                </label>
                <input
                  type="text"
                  id="certifications"
                  name="certifications"
                  value={formData.certifications.join(", ")}
                  onChange={handleChange}
                  placeholder="Enter Certifications (e.g., Organic, Fair Trade)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004526] transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#004526] hover:bg-[#004540]"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Updating Profile...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateProfileFarmer;
