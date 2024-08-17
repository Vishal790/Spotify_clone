import React from "react";
import Logo from "../assets/logo.png";
import Profile from "../assets/profile.png";

const Sidebar = () => {
  return (
    <div className="lg:max-w-[20vw] py-6 pl-8 lg:h-screen  flex lg:flex-col justify-between items-center lg:items-start  p-4">
      {/* Logo */}
      <img
        src={Logo}
        alt="Logo"
        className=" h-[35px] lg:w-[130px]"
      />

      {/* Profile Image */}
      <img
        src={Profile}
        alt="Profile"
        className="w-[48px] rounded-full "
      />
    </div>
  );
};

export default Sidebar;
