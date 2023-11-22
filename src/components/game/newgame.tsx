'use client'

import React, {useEffect, useState, KeyboardEvent} from 'react';
import {Wall, WallProps} from "@/components/game/wall";
import {Character, CHARACTER_HEIGHT, CHARACTER_WIDTH, CharacterProps} from "@/components/game/character";
import {v4 as uuidv4} from 'uuid';
import {Chats} from "@/components/game/chats";
import {IoCall, IoCloseSharp, IoVideocam} from "react-icons/io5";
import io from "socket.io-client";

type GameProps = {
    characters: CharacterProps[];
    walls: WallProps[];
};

export const gameSocket = io('http://localhost:3001');


export const Game: React.FC<GameProps> = ({characters, walls}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [messages, setMessages] = useState<string[]>([]);
    const [character, setCharacter] = useState<CharacterProps>({
        id: "kkhds",
        name: "Idino",
        position: {x: 500, y: 400},
        color: "#14b8bd",
        gender: "male"
    })
    const [showChat, setShowChat] = useState(true)
    const [currentRoom, setCurrentRoom] = useState<{
        room: string;
        characters: CharacterProps[]
    } | undefined>(undefined)
    const speed: number = 20;
    const [direction, setDirection] = useState<"right" | "left">("right")

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
                setDirection("left")
                break;
            case 'ArrowRight':
                newPosition.x += speed;
                setDirection("right")
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


    function handleJoinRoom({characters, room}: { characters: CharacterProps[]; room: string }) {
        console.log('Joining room', room);
        setCurrentRoom({room, characters})
    }

    function handleLeaveRoom() {
        setCurrentRoom(undefined)
    }


    useEffect(() => {
        gameSocket.on('message', (message) => {
            setMessages(prev=>[...prev,message])
        });

        return () => {
            gameSocket.off('message');
        };
    }, []);

    useEffect(() => {
        console.log(messages)
    }, [messages]);


    if (!character.id) {
        return (
            <div className={"h-screen w-screen flex flex-col justify-center items-center"}>
                <div className={"flex flex-col justify-center gap-4"}>
                    <h1 className={"text-2xl font-bold"}>Office-verse</h1>
                    <input className={"px-4 py-2"} value={character.name} type={"text"} placeholder={"Name"}
                           onChange={(e) => setCharacter({...character, name: e.target.value})}/>
                    <div className={"flex flex-col justify-center w-full"}>
                        <div className={"self-center flex flex-row gap-4"}><label htmlFor={"male"}>Male</label>
                            <input type={"radio"} id={"male"} checked={character.gender === "male"} name={"gender"}
                                   value={"male"}
                                   onChange={(e) => setCharacter({
                                       ...character,
                                       gender: e.target.value as "male" | "female"
                                   })}/></div>

                        <div className={"self-center flex flex-row gap-4"}>
                            <label htmlFor={"female"}>Female</label>
                            <input type={"radio"} checked={character.gender === "female"} name={"gender"}
                                   value={"female"}
                                   onChange={(e) => setCharacter({
                                       ...character,
                                       gender: e.target.value as "male" | "female"
                                   })}/>
                        </div>

                    </div>
                    <input value={character.color} className={"w-full h-10"} type={"color"}
                           onChange={(e) => setCharacter({...character, color: e.target.value})}/>
                    <button disabled={!character.name}
                            className={"bg-black disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2 text-white"}
                            onClick={() => setCharacter({...character, id: uuidv4()})}>Submit
                    </button>
                </div>
            </div>)
    }

    function handleToggleChat() {
        setShowChat(prev => !prev)
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
            {[character, ...characters].map((character, index) => {
                const otherCharacters = characters.filter((c) => c.id !== character.id);
                return (
                    <Character onToggleChat={handleToggleChat} index={index}
                               direction={direction}
                               currentRoom={currentRoom} onLeaveRoom={handleLeaveRoom}
                               onJoinRoom={handleJoinRoom}
                               key={character.id}
                               character={character} otherCharacters={otherCharacters}/>
                )
            })}
            {showChat && currentRoom?.room &&
                <div className={"fixed border-l-2 border-black bottom-0 h-full w-1/4 right-0 bg-white p-4"}>
                    <div className={"w-full flex flex-row justify-between items-center"}>
                        <button onClick={handleToggleChat}
                                className={"p-1  rounded-full duration-150 bg-black text-white"}><IoCloseSharp />
                        </button>
                        <span className={"font-bold whitespace-normal"}>Chat</span>
                        <div className={"flex flex-row items-center gap-2"}>
                            <button className={"p-2 rounded-full hover:bg-gray-200 duration-150"}><IoCall /></button>
                            <button className={"p-2 rounded-full hover:bg-gray-200 duration-150"}><IoVideocam /></button>

                        </div>
                        </div>
                    <div
                        className={"font-bold text-xs pt-3 text-center w-full whitespace-normal truncate"}>{currentRoom.characters[0].name} - {currentRoom.characters[1].name}</div>
                    <Chats roomId={currentRoom.room} messages={messages}/>
                </div>}
        </div>
    );
};

