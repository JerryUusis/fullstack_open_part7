import Notification from "./Notification";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = ({ handleLogout }) => {
  const user = useSelector((state) => state.user);
  const headerStyles = {
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
    backgroundColor: "lightGray",
  };
  return (
    <div>
      <div style={headerStyles}>
        <Link to={"/blogs"}>blogs</Link>
        <Link to={"/users"}>users</Link>
        <span>{user.username} logged in</span>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div>
        <h2 data-testid="blogs-header">blog App</h2>
        <Notification />
      </div>
    </div>
  );
};

export default Header;
