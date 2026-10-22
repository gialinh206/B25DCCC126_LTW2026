import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const activeStyle = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
    color: "red",
  });

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <NavLink to="/" end style={activeStyle}>
        Trang chủ
      </NavLink>{" "}
      {" | "}
      <NavLink to="/play" style={activeStyle}>
        Chơi
      </NavLink>{" "}
      {" | "}
      <NavLink to="/questions" style={activeStyle}>
        Ngân hàng câu hỏi
      </NavLink>{" "}
      {" | "}
      <NavLink to="/history" style={activeStyle}>
        Lịch sử
      </NavLink>
    </nav>
  );
};

export default NavBar;
