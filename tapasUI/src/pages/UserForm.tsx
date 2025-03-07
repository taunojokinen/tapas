import { useState, useEffect } from "react";

// Määritetään käyttäjän tyyppi
interface User {
  _id: string;
  name: string;
  email: string;
}

export default function UserForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  // Haetaan käyttäjät tietokannasta
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data: User[]) => setUsers(data))
      .catch((err) => console.error("Virhe haussa:", err));
  }, []);

  // Lähetetään uusi käyttäjä palvelimelle
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUser = { name, email };

    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      const savedUser: User = await response.json();
      setUsers([...users, savedUser]); // Päivitetään käyttäjälista
      setName("");
      setEmail("");
    } else {
      console.error("Virhe tallennuksessa");
    }
  };

  return (
    <div>
      <h2>Lisää uusi käyttäjä</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nimi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Lisää</button>
      </form>

      <h3>Käyttäjät tietokannassa:</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
