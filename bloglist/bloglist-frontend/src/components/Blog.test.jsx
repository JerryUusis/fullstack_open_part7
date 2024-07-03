import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect, vi } from "vitest";

describe("<Blog />", () => {
  const blog = {
    title: "test title",
    author: "Hurry Kane",
    url: "www.vantaa.fi",
    likes: 3,
    user:{
      username:"tester"
    }
  };
  const handleDelete = vi.fn();
  const handleUpdate = vi.fn();
  const currentUser = "tester";
  const blogElement = <Blog blog={blog} handleDelete={handleDelete} handleUpdate={handleUpdate} currentUser={currentUser}/>;

  test("renders blog title", () => {
    render(blogElement);

    const element = screen.getByTestId("blog");
    expect(element).toHaveTextContent(blog.title);
  });
  test("shows url, likes and user after pressing 'view' button", async () => {
    render(blogElement);

    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const togglable = screen.getByTestId("togglable-content");
    expect(togglable).toHaveTextContent(blog.url);
    expect(togglable).toHaveTextContent(`likes ${blog.likes}`);
    expect(togglable).toHaveTextContent(blog.author);
  });
  test("clicking like button twice", async () => {
    render(blogElement);

    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const likeButton = screen.getByTestId("like-button");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(handleUpdate).toHaveBeenCalled(2);
  });
});