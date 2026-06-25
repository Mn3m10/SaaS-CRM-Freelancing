/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import "./Profile.css";
import { FaPen } from "react-icons/fa";
import user_profile_image from "../../assets/images/default-user.jpg";

import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import {
  personalInfoSchema,
  passwordSchema,
} from "../../assets/utils/Validations";

import { success, failed } from "../../assets/utils/Toasts";
import { PasswordForm, PersonalDataFrom } from "../../components/ProfileForms";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone!",
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?._id || userData?.id;

      if (!token || !userId) {
        failed("Please login first");
        return;
      }

      setIsDeleting(true);

      const response = await fetch(
        `http://localhost:5000/api/v1/user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        failed(result.message || "Failed to delete account");
        setIsDeleting(false);
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      success("Account deleted successfully");

      navigate("/");
    } catch (error) {
      console.error("Delete account error:", error);
      failed("Server error. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  const personalInfo = useFormik({
    initialValues: {
      name: userData?.name || "",
      title: userData?.title || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
    },

    validationSchema: personalInfoSchema,
    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          failed("Please login first");
          return;
        }

        const userId = userData?._id;

        if (!userId) {
          failed("User ID not found");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/v1/user/${userId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          failed("Failed to update data");
          return;
        }

        localStorage.setItem("user", JSON.stringify(result.data));

        setUserData(result.data);

        success("Data updated successfully");

        personalInfo.resetForm({
          values: result.data,
        });
      } catch (error) {
        console.error("Update error:", error);
        failed("Server error please try again later");
      }
    },
  });

  const passwordInfo = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },

    validationSchema: passwordSchema,

    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          failed("Please login first");
          return;
        }
        const userId = userData?._id;
        if (!userId) {
          failed("User not found");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/v1/user/pass/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
              confirmNewPassword: values.confirmNewPassword,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          failed(result.message || "Failed to update password");
          return;
        }

        success("Password updated successfully");
        passwordInfo.resetForm();
      } catch (error) {
        console.error("Password update error:", error);
        failed("Server error please try again later");
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      failed("Please select an image first");
      return;
    }

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("profileImage", imageFile);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/v1/auth/set-user-image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        failed(data.message || "Failed to upload your image");
        setImageUploading(false);
        return;
      }

      const profileImage = data.user?.profileImage;

      const updatedUserData = {
        ...userData,
        profileImage: profileImage,
      };

      setUserData(updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      setPreviewImage("");
      setImageFile(null);
      setImageTimestamp(Date.now());

      success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      failed("Something went wrong");
    } finally {
      setImageUploading(false);
    }
  };

  const getImageUrl = () => {
    if (previewImage) {
      return previewImage;
    }

    if (userData?.profileImage) {
      const imagePath = userData.profileImage;

      if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
      }

      if (imagePath.startsWith("/")) {
        return `http://localhost:5000${imagePath}?t=${imageTimestamp}`;
      }

      return `http://localhost:5000/images/${imagePath}?t=${imageTimestamp}`;
    }

    return user_profile_image;
  };

  return (
    <section className="profile">
      <div className="container">
        <div className="title">
          <h1>Account Settings</h1>
          <p>Update your personal details and account preferences.</p>
        </div>
        <div className="image-box">
          <div>
            <div className="image">
              <div className="img-box">
                <img src={getImageUrl()} alt="user image" />
                <label htmlFor="profile-image">
                  <FaPen />
                </label>
              </div>
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="user-data">
              <h2>{userData?.name}</h2>
              <p>{`${userData.title ? userData?.title : "Undefined"}`}</p>
            </div>
          </div>
          <button
            onClick={handleUpload}
            className="img-btn"
            disabled={imageUploading}
          >
            {imageUploading ? "Uploading..." : "Change"}
          </button>
        </div>

        <div className="personal-info">
          <h1 className="profile-title">Personal Information</h1>
          <div className="inputs">
            <PersonalDataFrom personalInfo={personalInfo} />
          </div>
        </div>
        <div className="change-password">
          <h1 className="profile-title">Change Password</h1>
          <PasswordForm passwordInfo={passwordInfo} />
        </div>
        <div className="delete-account">
          <div>
            <h4>Delete Account</h4>
            <p>
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
          </div>
          <button className="delete-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
