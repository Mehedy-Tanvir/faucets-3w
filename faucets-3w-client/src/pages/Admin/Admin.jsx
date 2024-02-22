import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
const Admin = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    // getting the token from local storage
    const token = localStorage.getItem("token");
    // sending post request to server with token for getting user information
    if (token) {
      fetch("http://localhost:3000/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // updating the states
          setUsers(data.users);
          //   setUser(data);
          //   setLoading(false);
        })
        .catch((error) => {
          setUsers([]);
          console.log(error);
          //   setUser(null);
          //   setLoading(false);
        });
    }
  }, []);
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users?.length > 0 &&
          users?.map((user, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{user?.name}</td>
              <td>{user?.email}</td>
              <td>{user?.role}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default Admin;
