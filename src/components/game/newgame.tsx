'use client'

import React, {useEffect, useState, KeyboardEvent, useRef} from 'react';
import {Wall, WallProps} from "@/components/game/wall";
import {Character, CHARACTER_HEIGHT, CHARACTER_WIDTH, CharacterProps} from "@/components/game/character";
import {v4 as uuidv4} from 'uuid';
import {Chats} from "@/components/game/chats";
import {IoCall, IoCloseSharp, IoVideocam} from "react-icons/io5";
import io from "socket.io-client";

type GameProps = {
    walls: WallProps[];
};



export const gameSocket =process.env.NODE_ENV === "development" ? io( "http://localhost:3001") : io("http://officeverse.com", { path: '/socket.io/' });

export const Game: React.FC<GameProps> = ({ walls}) => {

    const speed: number = 20;
    const [windowWidth, setWindowWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);
    const [messages, setMessages] = useState<{message:string;sender:CharacterProps}[]>([]);
    const [music, setMusic] = useState({playing:false,src:""})
    const [character, setCharacter] = useState<CharacterProps>({
        id: "",
        name: "",
        position: {x: 500, y: 400},
        color: "#14b8bd",
        gender: "male",
    })
    const [characters, setCharacters] = useState<CharacterProps[]>([])

    const [showChat, setShowChat] = useState(false)
    const [gameLoading, setGameLoading] = useState(true)

    const [currentRoom, setCurrentRoom] = useState<{
        room: string;
        characters: CharacterProps[]
    } | undefined>(undefined)

    const [direction, setDirection] = useState<"right" | "left">("right")

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current && music.playing) {
            //ts-ignore
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch((error:any) => console.error('Audio Play Error:', error));
        }
    }, [music]);




    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const char = localStorage.getItem("character")
        if(char){
            setCharacter(JSON.parse(char))
        }
        setGameLoading(false)
    }, []);

    useEffect(() => {
        if(character.id){
            gameSocket.emit('newUser',character)
        }
    }, [character]);



    const isColliding = (newPosition: { x: number; y: number }) => {
        for (let wall of walls) {
            const inside = newPosition.x >= wall.x &&
                newPosition.x + CHARACTER_WIDTH <= wall.x + wall.width &&
                newPosition.y >= wall.y &&
                newPosition.y + CHARACTER_HEIGHT <= wall.y + wall.height;

            const colliding = newPosition.x < wall.x + wall.width &&
                newPosition.x + CHARACTER_WIDTH > wall.x &&
                newPosition.y < wall.y + wall.height &&
                newPosition.y + CHARACTER_HEIGHT > wall.y



            if(wall.passable === true){
                if(inside){
                    switch (wall.name) {
                        case "swimming-pool":
                            setMusic({playing:true,src:"/audio/swiming-pool.mp3"})
                            break;
                        default:
                            setMusic({playing:false,src:""})
                            break;
                    }
                }else{
                    setMusic({playing:false,src:""})
                }
                continue
            }
            if (colliding) {
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
        // console.log('Joining room', room);
        setCurrentRoom({room, characters})
    }

    function handleLeaveRoom() {
        setCurrentRoom(undefined)
    }




    useEffect(() => {
        gameSocket.on('connect', () => {
            console.log("User connected")
        });

        gameSocket.on('characters', (message) => {
            setCharacters(message)
        });
        gameSocket.on('receiveMessage', (message) => {
            console.log(message)
            setMessages(prev=>[...prev,message])
        });

        return () => {
            gameSocket.off('connect');
            gameSocket.off('characters');
            gameSocket.off('receiveMessage');
        };
    }, []);






    if(gameLoading){
        return <div className={"h-screen w-screen flex flex-col justify-center items-center"}> <div>Loading...</div></div>
    }

    function moveToFirst(array:CharacterProps[], id:string) {
        const index = array.findIndex(item => item.id === id); // id is a string

        if (index !== -1) {
            const [item] = array.splice(index, 1); // Remove the item from the array
            array.unshift(item); // Add the item to the beginning of the array
        }

        return array;
        }


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
                            onClick={() => {
                                const newChar = {...character, id: uuidv4()}
                                setCharacter(newChar)
                                localStorage.setItem("character",JSON.stringify(newChar))
                                }}>Submit
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
            {moveToFirst(characters,character.id).map((character, index) => {
                return (
                    <Character onToggleChat={handleToggleChat} index={index}
                               direction={direction}
                               currentRoom={currentRoom} onLeaveRoom={handleLeaveRoom}
                               onJoinRoom={handleJoinRoom}
                               key={character.id}
                               character={character} otherCharacters={characters}/>
                )
            })}
            {showChat  &&
                <div className={"fixed border-l-2 border-black bottom-0 h-full w-1/4 right-0 bg-white p-4"}>
                    <div className='flex flex-col justify-start h-full'>
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
                        className={"font-bold text-xs pt-3 text-center w-full whitespace-normal truncate"}>{currentRoom?.characters[0].name} - {currentRoom?.characters[1].name}</div>


                    <Chats user={character} messages={messages} roomId={currentRoom?.room!}/>
                    </div>



                </div>}
            {music.playing &&  <audio  ref={audioRef} src={music.src} autoPlay loop>
                Your browser does not support the audio element.
            </audio>}

        </div>
    );
};

