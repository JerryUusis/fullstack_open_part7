import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import BlogForm from "./BlogForm";

describe("<BlogForm />",() => {
  const handleNewBlog = vi.fn();
  const blogFormComponent = <BlogForm handleNewBlog={handleNewBlog}/>;
  test("renders component",() => {
    render(blogFormComponent);
    const blogFormElement = screen.getByTestId("blog-form");
    expect(blogFormElement).toHaveTextContent("title:");
    expect(blogFormElement).toHaveTextContent("author:");
    expect(blogFormElement).toHaveTextContent("url:");
  });
  test("create button calls handleNewBlog with correct parameters", async () => {
    render(blogFormComponent);

    const titleInput = screen.getByTestId("title-input");
    const authorInput = screen.getByTestId("author-input");
    const urlInput = screen.getByTestId("url-input");

    const user = userEvent.setup();
    await user.type(titleInput, "test title");
    await user.type(authorInput, "test author");
    await user.type(urlInput, "test url");

    // Check that the input elements' values are updated correctly

    expect(titleInput.value).toBe("test title");
    expect(authorInput.value).toBe("test author");
    expect(urlInput.value).toBe("test url");

    const createButton = screen.getByText("create");
    await user.click(createButton);

    // Check that handleNewBlog is called with the right parameters

    expect(handleNewBlog).toHaveBeenCalled(1);
    const parameters = handleNewBlog.mock.calls[0][0];
    expect(parameters).toEqual({ title: "test title", author: "test author", url: "test url" });
  });
});