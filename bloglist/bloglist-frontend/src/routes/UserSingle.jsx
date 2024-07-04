import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UserSingle = () => {
  const params = useParams();
  const users = useSelector((state) => state.userList);
  const user = users.find((u) => u.id === params.id);

  if (!user) {
    return null;
  }

  return (
    <>
      <h2>{user.username}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  );
};

export default UserSingle;
