import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Togglable from "./Togglable";

describe("<Togglable />", () => {
  beforeEach(() => {
    render(
      <Togglable openLabel="open" closeLabel="close">
        <div>togglable content</div>
      </Togglable>
    );
  });
  test("renders with no togglable content visible", () => {
    const togglableContent = screen.getByTestId("togglable-content");
    expect(togglableContent).toHaveStyle("display: none");
  });
  test("clicking open button reveals togglable content", async () => {
    const togglableContent = screen.getByTestId("togglable-content");
    const openButton = screen.getByText("open");
    const user = userEvent.setup();
    await user.click(openButton);
    expect(togglableContent).toHaveStyle("display: block");
  });
  test("clicking close button hides revealed content", async () => {
    const togglableContent = screen.getByTestId("togglable-content");
    const openButton = screen.getByText("open");
    const closeButton = screen.getByText("close");
    const user = userEvent.setup();
    await user.click(openButton);
    await user.click(closeButton);
    expect(togglableContent).toHaveStyle("display: none");
  });
});