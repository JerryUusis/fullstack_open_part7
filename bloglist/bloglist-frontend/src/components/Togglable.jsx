import { useState, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";

// Use forwardRef to access functions defined in useImperativeHandle hook
// Functions can be accessed with useRef hook from parent component
const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  Togglable.propTypes = {
    openLabel: PropTypes.string.isRequired,
  };

  Togglable.displayName = "Togglable";

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <>
      <div style={hideWhenVisible} data-testid="visible-content">
        <button onClick={toggleVisibility}>
          {props.openLabel}
        </button>
      </div>
      <div style={showWhenVisible} data-testid="togglable-content">
        {props.children}
        <button onClick={toggleVisibility}>{props.closeLabel}</button>
      </div>
    </>
  );
});

export default Togglable;
