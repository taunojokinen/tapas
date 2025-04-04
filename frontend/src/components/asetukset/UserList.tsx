import React from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  manager: string;
}

interface UserListProps {
  users: User[];
  handleDelete: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, handleDelete }) => {
  return (
    <ul className="space-y-4">
      {users.map((user) => (
        <li key={user._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md">
          <span className="text-lg font-medium">{user.name} - {user.email} - {user.role} - {user.manager}</span>
          <button 
            onClick={() => handleDelete(user._id)} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow">
            Poista
          </button>
        </li>
      ))}
    </ul>
  );
};

export default UserList;
