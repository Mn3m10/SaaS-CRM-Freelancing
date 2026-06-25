/* eslint-disable react-hooks/set-state-in-effect */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FaBell } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import default_user_img from "../assets/images/default-user.jpg";

const Navbar = () => {
  const [serach, setSearch] = useState("");

  const [userData, setUserData] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);
  return (
    <header className="header">
      <div className="input">
        <IoSearchSharp />
        <input
          type="text"
          placeholder="Search..."
          value={serach}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="data">
        <div className="icons">
          <div className="icon">
            <FaBell />
          </div>
          <div className="icon">
            <IoSettings />
          </div>
        </div>
        <div className="user">
          <div className="user-data">
            <h3>{userData?.name}</h3>
            <p>{userData?.title}</p>
          </div>
          <div className="user-img">
            <img
              src={`${userData?.profileImage ? `http://localhost:5000/images/${userData.profileImage}` : default_user_img}`}
              alt="user image"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
