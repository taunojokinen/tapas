import React from 'react';
import paamaara from '../pictures/paamaara.png';
import { Stage, Layer, Rect, Text } from 'react-konva';

// Define a JSON object with four text parameters
const arvot = [
    'Innovaatio – Teknologian jatkuva kehittäminen ja uusien ratkaisujen luominen',
    'Laatu ja luotettavuus – Korkealaatuisten, turvallisten ja skaalautuvien ohjelmistojen toimittaminen',
    'Asiakaslähtöisyys – Asiakkaan tarpeiden ymmärtäminen ja niihin vastaaminen',
    'Vastuullisuus – Ympäristövastuu, eettisyys ja yhteiskuntavastuu'
];
const perustehtava = 'Tarjoamme asiakkaillemme korkealaatuisia ohjelmistokehityspalveluita, jotka auttavat heitä saavuttamaan liiketoiminnalliset tavoitteensa tehokkaasti ja laadukkaasti.';
const nykytila = [
    'Asiakaspalaute on pääosin positiivista ja tuotteemme on helppokäyttöinen',
    'kuitenkin',
    'tuotteemme on teknisesti vanhentunut ja kilpailijat ovat kehittäneet vastaavia tuotteita, jotka ovat teknisesti edistyksellisempiä'
];
const visio = 'Olemme Suomen johtava ohjelmistokehityspalveluiden tarjoaja vuoteen 2030 mennessä';

// Function to split text into lines based on a maximum character length
const splitTextIntoLines = (text: string, maxLength: number) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length > maxLength) {
            lines.push(currentLine);
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    });

    lines.push(currentLine.trim());
    return lines;
};
import { Link } from "react-router-dom";

const Home: React.FC = () => {
    // Define the dimensions for the main rectangle
    const rectWidth = 1400;
    const rectHeight = 600;
    const rectX = 10;
    const rectY = 10;

    // Define the parameters for the small rects
    const smallRectWidth = .3*rectWidth;
    const smallRectHeight = .3*rectHeight;
    const smallRectX1 = rectX + 10
    const smallRectY1 = rectY + 10
    const smallRectX2 = rectWidth - 20 - smallRectWidth
    const smallRectY2 = rectHeight - 20 - smallRectHeight

    // Define the parameters for the heder texts
    const textSize= 24;
    const textX1 = smallRectX1 + 10;
    const textY1 = smallRectY1 + 10;
    const textX2 = smallRectX2 + 10;
    const textY2 = smallRectY2 + 10;

    // Define the parameters for the text
    const fontFamily = "Calibri";
    const fontSize = 20;

    const renderArvotText = () => {
        return arvot.map((arvo, index) => {
            const lines = splitTextIntoLines(arvo, 70); // Adjust the maxLength as needed
            return lines.map((line, lineIndex) => (
                <Text
                    key={`${index}-${lineIndex}`}
                    x={textX1}
                    y={textY1 + 24 + index * 60 + lineIndex * 24} // Adjust the y position for each line
                    text={line}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    fill="black"
                    width={smallRectWidth} // Set the maximum width for the text
                    lineHeight={1.5} // Set the line height for spacing
                />
            ));
        });
    };

    const renderNykytilaText = () => {
        return nykytila.map((tila, index) => {
            const lines = splitTextIntoLines(tila, 70); // Adjust the maxLength as needed
            return lines.map((line, lineIndex) => (
                <Text
                    key={`${index}-${lineIndex}`}
                    x={textX1}
                    y={textY2 + 24 + index * 50 + lineIndex * 24} // Adjust the y position for each line
                    text={line}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    fill="black"
                    width={smallRectWidth} // Set the maximum width for the text
                    lineHeight={1.5} // Set the line height for spacing
                />
            ));
        });
    };

    const renderVisioText = () => {
        const lines = splitTextIntoLines(visio, 40); // Adjust the maxLength as needed
        return lines.map((tila, index) => {
            return lines.map((line, lineIndex) => (
                <Text
                    key={`visio-${lineIndex}`}
                    x={textX2}
                    y={textY1 + 24 + 24*lineIndex } // Adjust the y position for each line
                    text={line}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    fill="black"
                    width={smallRectWidth} // Set the maximum width for the text
                    lineHeight={1.5} // Set the line height for spacing
                />
            ));
        });
    };

    const renderPerustehtavaText = () => {
        const lines = splitTextIntoLines(perustehtava, 50); // Adjust the maxLength as needed
        return lines.map((tila, index) => {
            return lines.map((line, lineIndex) => (
                <Text
                    key={`perustehtava-${lineIndex}`}
                    x={textX2}
                    y={textY2 + 24 + 24*lineIndex } // Adjust the y position for each line
                    text={line}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    fill="black"
                    width={smallRectWidth} // Set the maximum width for the text
                    lineHeight={1.5} // Set the line height for spacing
                />
            ));
        });
    }

    return (
        <div>
<<<<<<< HEAD
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <Rect
                        x={rectX}
                        y={rectY}
                        width={rectWidth}
                        height={rectHeight}
                        cornerRadius={20}
                        fill="#c1e2f7"
                        draggable
                    />
                    <Rect
                        x={smallRectX1} // Adjust the x position as needed
                        y={smallRectY1} // Adjust the y position as needed
                        width={smallRectWidth} // Adjust the width as needed
                        height={smallRectHeight} // Adjust the height as needed
                        cornerRadius={20}
                        fill="#ffffff"
                        draggable
                    />
                        <Rect
                        x={smallRectX2} // Adjust the x position as needed
                        y={smallRectY1} // Adjust the y position as needed
                        width={smallRectWidth} // Adjust the width as needed
                        height={smallRectHeight} // Adjust the height as needed
                        cornerRadius={20}
                        fill="#ffffff"
                        draggable
                    />
                    <Rect
                        x={smallRectX1} // Adjust the x position as needed
                        y={smallRectY2} // Adjust the y position as needed
                        width={smallRectWidth} // Adjust the width as needed
                        height={smallRectHeight} // Adjust the height as needed
                        cornerRadius={20}
                        fill="#ffffff"
                        draggable
                    />
                        <Rect
                        x={smallRectX2} // Adjust the x position as needed
                        y={smallRectY2} // Adjust the y position as needed
                        width={smallRectWidth} // Adjust the width as needed
                        height={smallRectHeight} // Adjust the height as needed
                        cornerRadius={20}
                        fill="#ffffff"
                        draggable
                    />

                    <Text
                        x={textX1}
                        y={textY1}
                        text="Arvot"
                        fontSize={textSize}
                        fontFamily={fontFamily}
                        fill="black"
                    />
                    {renderArvotText()}
                    <Text
                        x={textX2}
                        y={textY1}
                        text="Päämäärä"
                        fontSize={textSize}
                        fontFamily={fontFamily}
                        fill="black"
                    />
                    {renderVisioText()}
                    <Text
                        x={textX2}
                        y={textY2}
                        text="Perustehtävä"
                        fontSize={textSize}
                        fontFamily={fontFamily}
                        fill="black"
                    />
                    {renderPerustehtavaText()}
                        <Text
                        x={textX1}
                        y={textY2}
                        text="Nykytila"
                        fontSize={textSize}
                        fontFamily={fontFamily}
                        fill="black"
                    />
                    {renderNykytilaText()}

                </Layer>
            </Stage>

=======
            <h1>Tapas</h1>
            <h3>Johtamisavustin</h3>
            <p>Welcome to the Home Page!</p>
            <Link to="/dashboard">Go to Dashboard</Link>
>>>>>>> 91b0ce7465e8f71385eddc7cc4c44d27c8707d8d
        </div>
    );
};

export default Home;