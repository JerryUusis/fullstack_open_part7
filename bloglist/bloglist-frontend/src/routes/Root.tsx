import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Root = ({ user, handleLogout }) => {
  return (
    <div>
      {user === null ? null : <Header handleLogout={handleLogout} />}
      <Outlet />
    </div>
  );
};

export default Root;
