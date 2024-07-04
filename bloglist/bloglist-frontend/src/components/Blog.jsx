import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
  };

  return (
    <div style={blogStyle} data-testid={"blog"}>
      <span data-testid={"blog-title"}>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </span>
    </div>
  );
};

export default Blog;
