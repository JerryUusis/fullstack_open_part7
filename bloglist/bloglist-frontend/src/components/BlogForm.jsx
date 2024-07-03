import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  BlogForm.propTypes = {
    handleNewBlog: PropTypes.func.isRequired
  };

  const addBlog = (event) => {
    event.preventDefault();
    const newBlog = { title, author, url };
    handleNewBlog(newBlog);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div data-testid="blog-form">
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            name="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            data-testid="title-input"
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="Author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            data-testid="author-input"
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            data-testid="url-input"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
