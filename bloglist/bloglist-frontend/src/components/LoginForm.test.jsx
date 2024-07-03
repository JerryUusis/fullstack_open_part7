import { screen,render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

describe("<LoginForm />",() => {
  const handleLogin = vi.fn();
  beforeEach(() => {
    render(<LoginForm handleLogin={handleLogin}/>);
  });
  test("renders component", () => {
    const loginFormElement = screen.getByTestId("login-form");
    expect(loginFormElement).toHaveTextContent("Username");
    expect(loginFormElement).toHaveTextContent("Password");
    expect(loginFormElement).toHaveTextContent("Submit");
  });
  test("submit button calls handleLogin with correct parameters", async () => {
    const user = userEvent.setup();
    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");

    // Input values get updated correctly
    await user.type(usernameInput, "test user");
    await user.type(passwordInput, "testPassword");

    expect(usernameInput.value).toBe("test user");
    expect(passwordInput.value).toBe("testPassword");

    const submitButton = screen.getByText("Submit");
    await user.click(submitButton);
    expect(handleLogin).toHaveBeenCalled(1);
    const parameters = handleLogin.mock.calls[0];
    expect(parameters).toEqual([ "test user","testPassword" ]);
  });
});