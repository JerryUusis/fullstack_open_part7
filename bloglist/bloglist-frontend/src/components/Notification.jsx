
import { useSelector } from "react-redux";

const Notification = () => {
  const errorMessage = useSelector((state) => state.notification.message);
  const severity = useSelector((state) => state.notification.severity);

  if (errorMessage === "") {
    return null;
  }

  return (
    <div
      style={{
        border: "2px solid",
        borderColor: severity === "success" ? "green" : "red",
        background: "lightGray",
      }}
      data-testid="notification"
    >
      <p>{errorMessage}</p>
    </div>
  );
};

export default Notification;
