import PropTypes from "prop-types";

const Notification = ({ errorMessage, severity }) => {

  Notification.propTypes = {
    errorMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf([null])
    ]),
    severity: PropTypes.string.isRequired
  };

  if (errorMessage === null) {
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
