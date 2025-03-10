import asetukset from '../pictures/asetukset.png';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import AddUser from '../AddUser';

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
    <>
    <p>{message}</p>
         {/* <UserForm /> */}

         <div>
         <h1>User Management</h1>
         <AddUser />
         {/* <RegisterForm /> */}

       </div>
       <h3>Käyttäjät tietokannassa:</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email} -{user.role} - {user.manager}
            <button onClick={() => handleDelete(user._id)}>Poista</button>
          </li>
        ))}
      </ul>
    </>
    )
 
};

export default KayttajienAsetus;





 