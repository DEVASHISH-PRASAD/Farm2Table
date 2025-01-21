import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser, updateUser } from "../../Redux/Slices/AdminUserSlice";
import toast from "react-hot-toast";
import Header from "../Header";
import Footer from "../Footer";

const AdminUserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success("User deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Error deleting user");
      }
    }
  };

  const handleUpdate = async (userId, updatedData) => {
    try {
      await dispatch(updateUser({ userId, updatedData })).unwrap();
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error(err?.message || "Error updating user");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Full-width Header */}
      <div className="w-full">
        <Header />
      </div>

      <div className="flex-1 flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard - User Management</h1>

        {loading && <p className="text-lg text-gray-700">Loading users...</p>}
        {error && <p className="text-red-500 text-lg">Error: {error}</p>}

        <div className="w-full max-w-5xl">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden border">
            <thead className="bg-[#004526] text-white">
              <tr>
                <th className="py-3 px-4 text-center">S.No</th>
                <th className="py-3 px-4 text-center">Name</th>
                <th className="py-3 px-4 text-center">Email</th>
                <th className="py-3 px-4 text-center">Role</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b text-center">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{user.fullname}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdate(user._id, { role: e.target.value })}
                      className="border p-1 rounded-md"
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full-width Footer */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default AdminUserManagement;
