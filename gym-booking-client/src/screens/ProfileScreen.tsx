import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-tabs/style/react-tabs.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "./ProfileScreen.css";

interface UserProfile {
  genderIdentity: string;
  birthday: string;
  height: string;
  weight: string;
  location: string;
  username: string;
}

interface Booking {
  _id: string;
  name: string;
  instructor: string;
  schedule: string;
}

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [weightUnit, setWeightUnit] = useState("kg");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/user/profile", {
          headers: {
            "x-auth-token": token,
          },
        });
        setUserProfile(res.data);
        setEditedProfile(res.data); // Initialize edited profile with current profile data
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        toast.error("Failed to fetch user profile");
      }
    };

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/user/bookings", {
          headers: {
            "x-auth-token": token,
          },
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        toast.error("Failed to fetch bookings");
      }
    };

    fetchUserProfile();
    fetchBookings();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value } as UserProfile);
  };

  const handleDateChange = (date: Date | null) => {
    setEditedProfile({
      ...editedProfile,
      birthday: date ? date.toISOString().split("T")[0] : "",
    } as UserProfile);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/user/profile", editedProfile, {
        headers: {
          "x-auth-token": token,
        },
      });
      setUserProfile(editedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile");
    }
  };

  const heightOptions = Array.from({ length: 96 }, (_, i) => {
    const feet = Math.floor((i + 48) / 12);
    const inches = (i + 48) % 12;
    return `${feet}'${inches}"`;
  });

  const weightOptions =
    weightUnit === "kg"
      ? Array.from({ length: 200 }, (_, i) => (i + 30).toString()) // 30kg to 230kg
      : Array.from({ length: 200 }, (_, i) => {
          const stones = Math.floor(i / 14);
          const pounds = i % 14;
          return `${stones}st ${pounds}lb`;
        });

  const handleWeightUnitChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWeightUnit(e.target.checked ? "kg" : "st_lb");
    // Convert the weight to the selected unit
    if (editedProfile) {
      const currentWeight = parseFloat(editedProfile.weight);
      if (!isNaN(currentWeight)) {
        const newWeight =
          e.target.checked
            ? (currentWeight * 0.453592).toFixed(2)
            : (currentWeight / 0.453592).toFixed(2);
        setEditedProfile({ ...editedProfile, weight: newWeight });
      }
    }
  };

  return (
    <div className="profile-screen">
      <ToastContainer />
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr;
        </button>
        <h1>Profile</h1>
      </div>
      <Tabs>
        <TabList>
          <Tab>Personal Details</Tab>
          <Tab>Bookings</Tab>
        </TabList>

        <TabPanel>
          {userProfile ? (
            <div className="personal-details">
              {isEditing ? (
                <form onSubmit={handleSaveClick}>
                  <label>
                    Gender Identity:
                    <select
                      name="genderIdentity"
                      value={editedProfile?.genderIdentity || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label>
                    Birthday:
                    <DatePicker
                      selected={
                        editedProfile?.birthday
                          ? new Date(editedProfile.birthday)
                          : null
                      }
                      onChange={handleDateChange}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select a date"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </label>
                  <label>
                    Height:
                    <select
                      name="height"
                      value={editedProfile?.height || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {heightOptions.map((height) => (
                        <option key={height} value={height}>
                          {height}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Weight Unit:
                    <div className="toggle-switch">
                      <label className="toggle-label">
                        {weightUnit === "kg" ? "kg" : "st/lb"}
                      </label>
                      <input
                        type="checkbox"
                        id="weightUnitToggle"
                        checked={weightUnit === "kg"}
                        onChange={handleWeightUnitChange}
                      />
                      <label htmlFor="weightUnitToggle" className="slider"></label>
                    </div>
                  </label>
                  <label>
                    Weight:
                    <select
                      name="weight"
                      value={editedProfile?.weight || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {weightOptions.map((weight) => (
                        <option key={weight} value={weight}>
                          {weight}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Location:
                    <input
                      type="text"
                      name="location"
                      value={editedProfile?.location || ""}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Username:
                    <input
                      type="text"
                      name="username"
                      value={editedProfile?.username || ""}
                      onChange={handleInputChange}
                    />
                  </label>
                  <button type="submit">Save</button>
                </form>
              ) : (
                <>
                  <p>Gender Identity: {userProfile.genderIdentity}</p>
                  <p>Birthday: {userProfile.birthday}</p>
                  <p>Height: {userProfile.height}</p>
                  <p>
                    Weight: {userProfile.weight} {weightUnit}
                  </p>
                  <p>Location: {userProfile.location}</p>
                  <p>Username: {userProfile.username}</p>
                  <button onClick={handleEditClick}>Edit</button>
                </>
              )}
            </div>
          ) : (
            <p>Loading personal details...</p>
          )}
        </TabPanel>

        <TabPanel>
          <h2>Your Bookings</h2>
          {bookings.length > 0 ? (
            <ul>
              {bookings.map((booking) => (
                <li key={booking._id}>
                  <p>Class: {booking.name}</p>
                  <p>Instructor: {booking.instructor}</p>
                  <p>
                    Schedule:{" "}
                    {new Date(booking.schedule).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings found.</p>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ProfileScreen;
