import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUserList } from "../store/userListSlice";
import { Link } from "react-router-dom";

const UsersPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeUserList());
  }, []);

  const users = useSelector((state) => state.userList);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th colSpan={1}></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
