'use client'

import React, {useEffect, useState, KeyboardEvent} from 'react';
import {Wall, WallProps} from "@/components/game/wall";
import {Character, CHARACTER_HEIGHT, CHARACTER_WIDTH, CharacterProps} from "@/components/game/character";


type GameProps = {
    characters: CharacterProps[];
    walls: WallProps[];
};

export const Game: React.FC<GameProps> = ({characters, walls}) => {
    const [playerPosition, setPlayerPosition] = useState({x: 700, y: 200});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const speed: number = 10;
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isColliding = (newPosition: { x: number; y: number }) => {
        for (let wall of walls) {
            if (newPosition.x < wall.x + wall.width &&
                newPosition.x + CHARACTER_WIDTH > wall.x &&
                newPosition.y < wall.y + wall.height &&
                newPosition.y + CHARACTER_HEIGHT > wall.y) {
                return true;
            }
        }
        return false;
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        let newPosition = {...playerPosition};
        switch (e.key) {
            case 'ArrowUp':
                newPosition.y -= speed;
                break;
            case 'ArrowDown':
                newPosition.y += speed;
                break;
            case 'ArrowLeft':
                newPosition.x -= speed;
                break;
            case 'ArrowRight':
                newPosition.x += speed;
                break;
            default:
                return;
        }

        if (!isColliding(newPosition)) {
            setPlayerPosition(newPosition);
        }
    };

    useEffect(() => {
        // @ts-ignore
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            // @ts-ignore
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [playerPosition])

    characters[0].position = playerPosition;

    return (
        <div
            tabIndex={0}
            style={{
                position: 'relative',
                width: windowWidth,
                height: windowHeight,
                backgroundColor: '#EFDECD'
            }}
        >
            {walls.map((wall, index) => (
                <Wall wall={wall} key={index}/>
            ))}
            {characters.map((character) => {
                const otherCharacters = characters.filter((c) => c.id !== character.id);
                return <Character key={character.id} character={character} otherCharacters={otherCharacters}/>
            })}
        </div>
    );
};

