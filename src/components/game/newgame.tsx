'use client'

import React, {useEffect, useState, KeyboardEvent} from 'react';
import {Wall, WallProps} from "@/components/game/wall";
import {Character, CHARACTER_HEIGHT, CHARACTER_WIDTH, CharacterProps} from "@/components/game/character";
import {v4 as uuidv4} from 'uuid';

type GameProps = {
    characters: CharacterProps[];
    walls: WallProps[];
};


export const Game: React.FC<GameProps> = ({characters, walls}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [character, setCharacter] = useState<CharacterProps>({id: "", name: "", position: {x: 500, y: 400}, color:"#14b8bd"})
    const [currentRoom, setCurrentRoom] = useState<{ room: string; character: CharacterProps } | undefined>(undefined)
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
        let newPosition = {...character.position};
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
            setCharacter(prev => ({...prev, position: newPosition}));
        }
    };

    useEffect(() => {
        // @ts-ignore
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            // @ts-ignore
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [character.position])


    function handleJoinRoom({character, room}: { character: CharacterProps; room: string }) {
        console.log('Joining room', room);
        console.table(character)
        setCurrentRoom({room, character})
    }

    function handleLeaveRoom() {
        setCurrentRoom(undefined)
    }

    useEffect(() => {
        console.log(currentRoom)
    }, [currentRoom]);


    if (!character.id) {
        return (
            <div className={"h-screen w-screen flex flex-col justify-center items-center"}>
                <div className={"flex flex-col justify-center gap-4"}>
                    <h1 className={"text-2xl font-bold"}>Office-verse</h1>
                    <input className={"px-4 py-2"} value={character.name} type={"text"} placeholder={"Name"}
                           onChange={(e) => setCharacter({...character, name: e.target.value})}/>
                    <input value={character.color} className={"w-full h-10"} type={"color"} onChange={(e) => setCharacter({...character, color: e.target.value})}/>
                    <button disabled={!character.name} className={"bg-black disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2 text-white"} onClick={() => setCharacter({...character, id: uuidv4()})}>Submit</button>
                </div>
            </div>)
    }

    return (
        <div
            tabIndex={0}
            style={{
                position: 'relative',
                width: windowWidth,
                height: windowHeight,
            }}
        >
            {walls.map((wall, index) => (
                <Wall wall={wall} key={index}/>
            ))}
            {[character, ...characters].map((character) => {
                const otherCharacters = characters.filter((c) => c.id !== character.id);
                return (
                    <Character currentRoom={currentRoom} onLeaveRoom={handleLeaveRoom} onJoinRoom={handleJoinRoom}
                               key={character.id}
                               character={character} otherCharacters={otherCharacters}/>
                )
            })}
        </div>
    );
};

