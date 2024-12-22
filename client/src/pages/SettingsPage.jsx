import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';  
import { FaUser, FaPlus } from "react-icons/fa"; 
import { useAuthContext } from "../context/AuthContext";
import '../css/settingsPage.css';

const SettingsPage = () => {
  const { authUser } = useAuthContext();
  const { id, role } = authUser; 

  console.log("Id: ", id)
  console.log("Role: ", role)


  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [profile, setProfile] = useState({
    username: "",  
    role: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    profile_photo: "", 
    address: "",
    dob: "",
    resume: "",
    github_link: "",
    linkedin_link: "",
    company_name: "", // Added for employers
    company_phone: "", // Added for employers
    company_address: "", // Added for employers
    num_employees: "", // Added for employers
    industry: "", // Added for employers
    company_website: "", // Added for employers
  });

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`http://localhost:3001/api/users/${id}?role=${role}`);
        const fetchedProfile = response.data;

        console.log("Fetched data: ", fetchedProfile);
        console.log("Profile", profile)

        setProfile((prevProfile) => ({
          ...prevProfile,
          username: fetchedProfile.username || prevProfile.username,
          role: fetchedProfile.role || prevProfile.role,
          first_name: fetchedProfile.first_name || prevProfile.first_name,
          last_name: fetchedProfile.last_name || prevProfile.last_name,
          phone_number: fetchedProfile.phone_number || prevProfile.phone_number,
          profile_photo: fetchedProfile.profile_photo || prevProfile.profile_photo,
          address: fetchedProfile.address || prevProfile.address,
          dob: fetchedProfile.dob || prevProfile.dob,
          resume: fetchedProfile.resume || prevProfile.resume,
          github_link: fetchedProfile.github_link || prevProfile.github_link,
          linkedin_link: fetchedProfile.linkedin_link || prevProfile.linkedin_link,
          company_name: fetchedProfile.company_name || prevProfile.company_name,
          company_phone: fetchedProfile.company_phone || prevProfile.company_phone,
          company_address: fetchedProfile.company_address || prevProfile.company_address,
          num_employees: fetchedProfile.num_employees || prevProfile.num_employees,
          industry: fetchedProfile.industry || prevProfile.industry,
          company_website: fetchedProfile.company_website || prevProfile.company_website,
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    setProfile((prevProfile) => ({
      ...prevProfile,
      profile_photo: file ? URL.createObjectURL(file) : prevProfile.profile_photo, 
    }));
  };

  const handleSubmit = async (e) => {
    console.log("Profile", profile)
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/users/${id}?role=${role}`, profile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="settings-page-wrapper">
      <h2>Complete your {capitalizeFirstLetter(role)} profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Profile Picture Upload */}
        <div className="profile-pic-upload">
          <label htmlFor="profile-pic-input" className="profile-pic-label">
            {profile.profile_photo ? (
              <img src={profile.profile_photo} alt="Profile" className="profile-pic" />
            ) : (
              <div className="profile-pic-placeholder">
                <FaUser className="user-icon" />
                <FaPlus className="plus-icon" />
              </div>
            )}
          </label>
          <input
            type="file"
            id="profile-pic-input"
            name="profile_photo"
            accept="image/*"
            onChange={handleProfilePicUpload}
            style={{ display: "none" }}
          />
        </div>

        <label>
          Username:
          <input type="text" name="username" readOnly value={profile.username} onChange={handleInputChange} />
        </label>

        {/* <label>
          Role:
          <input type="text" name="role" value={profile.role} readOnly />
        </label> */}

        {role === 'applicant' && (
          <>
            <label>
              First Name:
              <input type="text" name="first_name" value={profile.first_name} onChange={handleInputChange} />
            </label>

            <label>
              Last Name:
              <input type="text" name="last_name" value={profile.last_name} onChange={handleInputChange} />
            </label>

            <label>
              Phone Number:
              <input type="text" name="phone_number" value={profile.phone_number} onChange={handleInputChange} />
            </label>

            <label>
              Address:
              <input type="text" name="address" value={profile.address} onChange={handleInputChange} />
            </label>

            <label>
              Date of Birth:
              <input type="date" name="dob" value={profile.dob} onChange={handleInputChange} />
            </label>

            <label>
              Resume:
              <input type="text" name="resume" value={profile.resume} onChange={handleInputChange} />
            </label>

            <label>
              GitHub Link:
              <input type="text" name="github_link" value={profile.github_link} onChange={handleInputChange} />
            </label>

            <label>
              LinkedIn Link:
              <input type="text" name="linkedin_link" value={profile.linkedin_link} onChange={handleInputChange} />
            </label>
          </>
        )}

        {role === 'employer' && (
          <>
            <label>
              Company Address:
              <input type="text" name="company_address" value={profile.company_address} onChange={handleInputChange} />
            </label>

            <label>
              Company Phone:
              <input type="text" name="company_phone" value={profile.company_phone} onChange={handleInputChange} />
            </label>

            <label>
              Number of Employees:
              <input type="text" name="num_employees" value={profile.num_employees} onChange={handleInputChange} />
            </label>

            <label>
              Industry:
              <input type="text" name="industry" value={profile.industry} onChange={handleInputChange} />
            </label>

            <label>
              Company Website:
              <input type="text" name="company_website" value={profile.company_website} onChange={handleInputChange} />
            </label>
          </>
        )}

        <button type="submit" className="save-btn">Save Profile</button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default SettingsPage;
