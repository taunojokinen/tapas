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
      const response = await axios.post("http://localhost:5000/api/auth/register", {
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
    <div>
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label>Manager:</label>
          <input
            type="text"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            
          />
        </div>
        <button type="submit">Add User</button>
      </form>

      {message && <p>{message}</p>} {/* Näyttää ilmoituksen onnistuneesta tai epäonnistuneesta lisäyksestä */}
    </div>
  );
};

export default AddUser;
