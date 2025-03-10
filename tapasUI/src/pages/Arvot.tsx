import React, { useState, useEffect } from "react";
import axios from "axios";
import { Stage, Layer, Rect, Text } from 'react-konva';

interface Arvo {
  nimi: string;
  kuvaus: string;
  tärkeys: number;
}

interface YritysArvot {
  _id: string;
  yritys: string;
  arvot: Arvo[];
}

const rectWidth = .7 * window.innerWidth// Adjust the width based on the window width
const rectHeight = .7 * window.innerHeight;
const padding = rectWidth/40;
const rectX = 10;
const rectY = 10;

// Define the parameters for the small rects
const smallRectWidth = rectWidth - 2 * padding;
const smallRectHeight = rectHeight - 2 * padding;
const smallRectX1 = rectX + padding
const smallRectY1 = rectY + padding

// Define the parameters for the header texts
const textX1 = smallRectX1 + padding;
const textY1 = smallRectY1 + padding;

    // Define the parameters for the text
const fontFamily = "Calibri";
const fontSize = window.innerWidth / 80;
const rivinvali = 1.3 * fontSize;

const Arvot: React.FC = () => {
  const [kaikkiArvot, setKaikkiArvot] = useState<YritysArvot[]>([]); // Kaikki arvot tietokannasta
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const renderArvotText = (): React.ReactElement[] => {
    const texts: React.ReactElement[] = [];
    const maxRowLength = smallRectWidth - 2 * padding; // Set the maximum row length based on the width
    const charsPerLine = Math.floor(maxRowLength / (fontSize * 0.35)); // Estimate characters per line based on font size
    let yOffset = textY1 + 2.5 * rivinvali;
  
    kaikkiArvot.forEach((yritys: YritysArvot) => {
      yritys.arvot.forEach((arvo: Arvo, index: number) => {
        texts.push(
          <Text
            key={`${yritys._id}-${index}-nimi`}
            x={textX1}
            y={yOffset}
            text={arvo.nimi}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fill="black"
            fontStyle="bold"
            
          />
        );
        yOffset += rivinvali;
  
        texts.push(
          <Text
            key={`${yritys._id}-${index}-kuvaus`}
            x={textX1}
            y={yOffset}
            width={smallRectWidth - 2 * padding}
            text={arvo.kuvaus}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fill="black"
          />
        );
      // Calculate the number of lines required for arvo.kuvaus
      const lines = Math.ceil(arvo.kuvaus.length / charsPerLine);
      yOffset += lines * (rivinvali);
      });
    });
  
    return texts;
  };



  /** 🔄 Haetaan yrityksen arvot tietokannasta */
  const fetchArvot = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/arvot");

      // Varmistetaan, että data on taulukko
      const data = Array.isArray(response.data) ? response.data : [];
      setKaikkiArvot(data);
      setLoading(false);
    } catch (err) {
      setError("Tietojen hakeminen epäonnistui.");
      console.error("Virhe:", err);
      setLoading(false);
    }
  };

  /** ⏳ Haetaan arvot **vain kerran** kun komponentti renderöityy */
  useEffect(() => {
    fetchArvot();
  }, []);


  return (
    <>
        <div>
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <Rect
                        x={rectX}
                        y={rectY}
                        width={rectWidth}
                        height={rectHeight}
                        cornerRadius={20}
                        fill="#c1e2f7"
                    />
                    <Rect
                        x={smallRectX1} // Adjust the x position as needed
                        y={smallRectY1} // Adjust the y position as needed
                        width={smallRectWidth} // Adjust the width as needed
                        height={smallRectHeight} // Adjust the height as needed
                        cornerRadius={20}
                        fill="#ffffff"
                    />
                    <Text
                        x={smallRectX1 + padding}
                        y={smallRectY1 + padding}
                        text="ARVOT"
                        fontSize={1.5 * fontSize}
                        fontFamily={fontFamily}
                        fill="black"
                        fontStyle="bold"
                    />
                    {renderArvotText()}
                </Layer>
            </Stage>

        {message && <p>{message}</p>}
      </div>
      <div>
        {loading ? (
          <p>Ladataan...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <p>Data loaded successfully!</p>
        )}
      </div>
    </>
  );

};

export default Arvot;
