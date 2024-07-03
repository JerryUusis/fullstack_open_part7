import { useState } from "react";
import PropTypes from "prop-types";

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  Login.propTypes = {
    handleLogin: PropTypes.func.isRequired
  };
  const login = (event) => {
    event.preventDefault();
    handleLogin(username, password);
    setUsername("");
    setPassword("");
  };

  return (
    <form onSubmit={login} data-testid="login-form">
      <div>
        Username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={(event) => setUsername(event.target.value)}
          data-testid="username-input"
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={(event) => setPassword(event.target.value)}
          data-testid="password-input"
        />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default Login;
