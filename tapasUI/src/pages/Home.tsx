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

const Home: React.FC = () => {
    const rectWidth = 1400;
    const rectHeight = 600;
    const padding = 20;
    const ptXadjust = 100;
    const ptYadjust = 80;
    const fontFamily = "Calibri";
    const fontSize = 20;

    const renderArvotText = () => {
        return arvot.map((arvo, index) => {
            const lines = splitTextIntoLines(arvo, 70); // Adjust the maxLength as needed
            return lines.map((line, lineIndex) => (
                <Text
                    key={`${index}-${lineIndex}`}
                    x={40}
                    y={80 + index * 60 + lineIndex * 24} // Adjust the y position for each line
                    text={line}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    fill="black"
                    width={1300} // Set the maximum width for the text
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
                    x={40}
                    y={rectHeight - padding - (nykytila.length * 60) + index * 60 + lineIndex * 24} // Adjust the y position for each line
                    text={line}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    fill="black"
                    width={1300} // Set the maximum width for the text
                    lineHeight={1.5} // Set the line height for spacing
                />
            ));
        });
    };

    const renderVisioText = () => {
        const lines = splitTextIntoLines(visio, 50); // Adjust the maxLength as needed
        return lines.map((tila, index) => {
            return lines.map((line, lineIndex) => (
                <Text
                    key={`visio-${lineIndex}`}
                    x={0.5 * rectWidth + ptXadjust}
                    y={80  + lineIndex * 24} // Adjust the y position for each line
                    text={line}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    fill="black"
                    width={800} // Set the maximum width for the text
                    lineHeight={1.5} // Set the line height for spacing
                />
            ));
        });
    };

    return (
        <div>
            <h1>Tapas Johtamisavustin</h1>
            <p>Welcome to the Home Page!</p>
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <Rect
                        x={20}
                        y={20}
                        width={rectWidth}
                        height={rectHeight}
                        cornerRadius={20}
                        fill="#c1e2f7"
                        draggable
                    />
                    <Rect
                        x={30} // Adjust the x position as needed
                        y={30} // Adjust the y position as needed
                        width={.5*rectWidth - 120} // Adjust the width as needed
                        height={.5*rectHeight - 30} // Adjust the height as needed
                        cornerRadius={20}
                        fill="#ffffff"
                        draggable
                    />
                        <Rect
                        x={780} // Adjust the x position as needed
                        y={30} // Adjust the y position as needed
                        width={.5*rectWidth - 120} // Adjust the width as needed
                        height={.5*rectHeight - 30} // Adjust the height as needed
                        cornerRadius={20}
                        fill="#ffffff"
                        draggable
                    />
                    <Rect
                        x={30} // Adjust the x position as needed
                        y={330} // Adjust the y position as needed
                        width={.5*rectWidth - 120} // Adjust the width as needed
                        height={.5*rectHeight - 30} // Adjust the height as needed
                        cornerRadius={20}
                        fill="#ffffff"
                        draggable
                    />
                        <Rect
                        x={780} // Adjust the x position as needed
                        y={330} // Adjust the y position as needed
                        width={.5*rectWidth - 120} // Adjust the width as needed
                        height={.5*rectHeight - 30} // Adjust the height as needed
                        cornerRadius={20}
                        fill="#ffffff"
                        draggable
                    />

                    <Text
                        x={40}
                        y={40}
                        text="Arvot"
                        fontSize={24}
                        fontFamily={fontFamily}
                        fill="black"
                    />
                    {renderArvotText()}
                    <Text
                        x={800}
                        y={350}
                        text="Perustehtävä"
                        fontSize={24}
                        fontFamily={fontFamily}
                        fill="black"
                    />
                    <Text
                        x={0.5 * rectWidth + ptXadjust} // Adjust the x position as needed
                        y={0.5 * rectHeight + ptYadjust} // Adjust the y position as needed
                        text={perustehtava}
                        fontSize={fontSize}
                        fontFamily={fontFamily}
                        fill="black"
                        align="left"
                        verticalAlign="bottom"
                        width={0.5 * rectWidth - 2 * padding} // Set the maximum width for the text
                        lineHeight={1.5} // Set the line height for spacing
                    />
                        <Text
                        x={40}
                        y={350}
                        text="Nykytila"
                        fontSize={24}
                        fontFamily={fontFamily}
                        fill="black"
                    />
                    {renderNykytilaText()}
                    <Text
                        x={800}
                        y={40}
                        text="Päämäärä"
                        fontSize={24}
                        fontFamily={fontFamily}
                        fill="black"
                    />
                    {renderVisioText()}
                </Layer>
            </Stage>
            <img src={paamaara} alt="Päämäärä" style={{ width: '50%', height: 'auto' }} className='header-logo'/>
        </div>
    );
};

export default Home;