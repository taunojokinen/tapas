import React from 'react';
import kata from '../pictures/Kata.png';
import { Stage, Layer, Rect, Text } from 'react-konva';

// Define a JSON object with four text parameters
const arvot = [
    { header: 'Innovaatio', content: 'Teknologian jatkuva kehittäminen ja uusien ratkaisujen luominen.' },
    { header: 'Laatu ja luotettavuus', content: 'Korkealaatuisten, turvallisten ja skaalautuvien ohjelmistojen toimittaminen' },
    { header: 'Asiakaslähtöisyys', content: 'Käyttäjien tarpeiden ja palautteen asettaminen kehityksen keskiöön' },
    { header: 'Yhteistyö ja rehellisyys', content: 'Avoimuuden, tiimityön ja eettisen kehityksen vaaliminen' }
];

const rectWidth = .7 * window.innerWidth// Adjust the width based on the window width
const rectHeight = 600;
const padding = 20;
const rectX = 10;
const rectY = 10;

// Define the parameters for the small rects
const smallRectWidth = rectWidth - 2 * padding;
const smallRectHeight = rectHeight - 2 * padding;
const smallRectX1 = rectX + 20
const smallRectY1 = rectY + 20

// Define the parameters for the header texts
const textX1 = smallRectX1 + padding;
const textY1 = smallRectY1 + padding;

    // Define the parameters for the text
const fontFamily = "Calibri";
const fontSize = window.innerWidth / 80;
const rivinvali = 2;
const spaceLimit= 2*smallRectWidth/fontSize

const splitTextIntoLines = (text: string, maxLength: number) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length > maxLength) {
            lines.push(currentLine.trim()); // Trim the current line before pushing
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    });

    lines.push(currentLine.trim()); // Trim the last line before pushing
    return lines;
};

const calculateLongestLine = () => {
    let longestLine = 0;
    arvot.forEach(arvo => {
        const lines = splitTextIntoLines(arvo.content, spaceLimit);
        lines.forEach(line => {
            if (line.length > longestLine) {
                longestLine = line.length;
            }
        });
    });
    return longestLine;
};

const longestLine = calculateLongestLine();
const renderArvotText = () => {
    let cumulativeHeight = 2*fontSize;
    return arvot.map((arvo, index) => {
        const headerElement = (
            <Text
                key={`header-${index}`}
                x={textX1}
                y={textY1 + cumulativeHeight}
                text={arvo.header}
                fontSize={1.3 * fontSize}
                fontFamily={fontFamily}
                fill="black"
                width={2 * smallRectWidth}
                lineHeight={rivinvali}
                fontStyle="bold"
            />
        );
        cumulativeHeight += fontSize * rivinvali;

        const lines = splitTextIntoLines(arvo.content, spaceLimit);
        const contentElements = lines.map((line, lineIndex) => (
            <Text
                key={`content-${index}-${lineIndex}`}
                x={textX1}
                y={textY1 + cumulativeHeight + lineIndex * fontSize * rivinvali}
                text={line}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fill="black"
                width={2 * smallRectWidth}
                lineHeight={rivinvali}
            />
        ));
        cumulativeHeight += lines.length * fontSize * rivinvali;

        return [headerElement, ...contentElements];
    });
};


const Arvot: React.FC = () => {
    return (
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
        </div>

    );
};

export default Arvot;