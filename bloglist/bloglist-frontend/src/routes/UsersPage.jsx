import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUserList } from "../store/userListSlice";

const UsersPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeUserList());
  }, []);

  const users = useSelector((state) => state.userList);

  return (
    <div>
      <h2>Users</h2>
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
              <td>{user.username}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
