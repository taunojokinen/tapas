import React, { useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";  // Importoi AxiosError

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [manager, setManager] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role,
        manager
      });
      console.log("Lähetettävä data:", { name, email, password, role, manager });

      setMessage(response.data.message);
      // Voit myös tyhjentää lomakkeen kentät onnistuneen lisäyksen jälkeen
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setManager("");
    } catch (error: unknown) {
        // Tyyppimuutos axios-virheeksi
        if (axios.isAxiosError(error)) {
          console.error("Error adding user:", error.response ? error.response.data : error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        setMessage("Error adding user.");
      }
  };

  return (
    <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Add New User</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
        {/* Kenttien sijoittelu koko leveydelle */}
        <div className="w-full md:w-1/5">
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>
  
        <div className="w-full md:w-1/5">
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>
  
        <div className="w-full md:w-1/5">
          <label className="block font-medium">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>
  
        <div className="w-full md:w-1/5">
          <label className="block font-medium">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
  
        <div className="w-full md:w-1/5">
          <label className="block font-medium">Manager:</label>
          <input
            type="text"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
  
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg">
          Add User
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
  </div>
);
  
  
}


export default AddUser;
