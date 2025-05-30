import React, { useState, useEffect } from "react";
import { fetchUserTitlesByUsername } from "./myObjectiveFunctions";
import McVirtanen from "../../pictures/McVirtanen.jpg"; // Adjust the path if needed

interface MyCoachProps {
  user: string;
}

const MyCoach: React.FC<MyCoachProps> = ({ user }) => {
  const [title, setTitle] = useState<string>(""); // State for the title

  const introduction = `Moi! Olen Micco McVirtanen – uravalmentaja, HR-asiantuntija ja työelämän energiapakkaus. Autan ihmisiä löytämään suunnan uralleen rennolla, rehellisellä ja ratkaisukeskeisellä otteella – ilman turhaa korporaatiohöpinää. Tunnen sekä työnantajien että työntekijöiden haasteet, ja löydän keinot, joilla unelmat ja realiteetit voivat kohdata. Kanssani voit puhua urapulmista, palkkaneuvotteluista tai vaikka siitä, miten kestää kollega, joka suihkii liikaa hajuvettä. Olen kuin urasi GPS ilman ärsyttäviä uudelleenreittejä. Luon luottamuksellisen ilmapiirin, jossa voit olla oma itsesi. Jos kaipaat sparrausta, suunnan selkeyttämistä tai vain hyvän keskustelun – jutellaan! Lupaan, että saat ainakin yhden tarinan mukaasi.`;

  const fetchAndSetTitle = async () => {
    if (user) {
      const titles = await fetchUserTitlesByUsername(user);
      if (titles && titles.length > 0) {
        setTitle(titles[0]); // Set the first title found
      }
    }
  };

  useEffect(() => {
    fetchAndSetTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      <div className="flex items-center justify-between p-4 shadow mb-0 ml-4">
        <h2 className="text-xl font-bold text-gray-800">
          {title} {user} - omat tavoitteet.
        </h2>
      </div>
      <div className="flex flex-row items-start gap-6 p-4">
        <img
          src={McVirtanen}
          alt="McVirtanen"
          className="w-32 h-32 object-cover rounded shadow"
        />
        <div className="flex-1">
          <textarea
            id="introduction"
            name="introduction"
            className="w-full border border-gray-300 rounded p-2"
            rows={5}
            value={introduction}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default MyCoach;
