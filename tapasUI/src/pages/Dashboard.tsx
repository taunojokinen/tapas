import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import AdminDashboard from "./AdminDashboard";
//import ManagerDashboard from "./ManagerDashboard";
//import UserDashboard from "./UserDashboard";
import UserForm from './UserForm';
import AddUser from '../pages/AddUser';
import RegisterForm from '../pages/RegisterForm';

const jwt_decode = require('jwt-decode');


const Dashboard: React.FC = () => {
  
  const [message, setMessage] = useState("");
    useEffect(() => {
        axios.get("http://localhost:5000")
          .then(res => setMessage(res.data))
          .catch(err => console.error("Virhe:", err));
      }, []);

  return (
    <>
    <div>
      <h1>Welcome to the Dashboard!</h1>
    </div>
    <p>{message}</p>
         <UserForm />

         <div>
         <h1>User Management</h1>
         <AddUser />
         <RegisterForm />
         {/* <h1>React + Express + MongoDB</h1>
         <p>{message}</p>
         <UserForm /> */}
       </div>
    </>
    )
 
};

export default Dashboard;


 /* const token = localStorage.getItem('token');

  if (!token) {
    return <div>Ei tunnistetta</div>; // Jos token ei ole olemassa, näytetään virheilmoitus
  }

  try {
    const decoded = jwt_decode(token);  // Dekoodaa token
    console.log(decoded); // Näytetään dekoodatut tiedot, kuten käyttäjän rooli
    
    if (decoded.role === 'admin') {
      return <AdminDashboard />;
    } else if (decoded.role === 'manager') {
      return <ManagerDashboard />;
    } else {
      return <UserDashboard />;
    }
  } catch (error) {
    return <div>Virhe tokenin dekoodauksessa</div>;  // Jos tokenin dekoodauksessa on virhe
  } */