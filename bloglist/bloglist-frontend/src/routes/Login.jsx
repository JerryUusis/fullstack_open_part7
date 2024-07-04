const Login = ({ handleLogin }) => {
  return (
    <>
      <h2>Log in to application</h2>
      <Notification />
      <LoginForm handleLogin={handleLogin} />
    </>
  );
};
