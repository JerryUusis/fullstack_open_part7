import Notification from "./Notification";
import { useSelector } from "react-redux";

const Header = ({ handleLogout }) => {
  const user = useSelector((state) => state.user);
  return (
    <>
      <div>
        <h2 data-testid="blogs-header">blogs</h2>
        <Notification />
      </div>
      <div>
        {user.username} logged in
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default Header;
