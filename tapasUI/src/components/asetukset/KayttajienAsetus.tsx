
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import AddUser from './AddUser';
import UserList from './UserList';

const jwt_decode = require('jwt-decode');

// Määritetään käyttäjän tyyppi
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  manager: string;
}


const KayttajienAsetus: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

  const [message, setMessage] = useState("");
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Virhe käyttäjien haussa:", error);
    }
  };

  const handleDelete = async (userId:string) => {
    //console.log("Poistetaan käyttäjä ID:", userId); // 🔍 Tarkista, lähetetäänkö oikea ID
    if (!window.confirm("Haluatko varmasti poistaa käyttäjän?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      //console.log("DELETE-pyyntö lähetetty!");
      setUsers(users.filter(user => user._id !== userId)); // Poistaa käyttäjän UI:sta ilman uudelleenlatausta
    } catch (error) {
      console.error("Virhe käyttäjän poistossa:", error);
    }
  };

    console.log("Users: ", users);

    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{message}</p>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">User Management</h1>
          <AddUser />
        </div>
        
        <h3 className="text-xl font-semibold mt-6 mb-4">Käyttäjät tietokannassa:</h3>
        <ul className="space-y-4">
          <UserList users={users} handleDelete={handleDelete} />

        </ul>
      </div>
    );
  };
  
 


export default KayttajienAsetus;





 