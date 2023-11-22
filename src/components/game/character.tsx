'use client'
import React, {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import chat from "../../assets/chat.gif"
import io from 'socket.io-client';



export type CharacterProps = {
    id: string
    position: { x: number, y: number }
    name: string
    otherCharacters?: { id: string; position: { x: number, y: number }, name: string }[]
    color: string
}

export const CHARACTER_HEIGHT = 70;
export const CHARACTER_WIDTH = 80;

type CharacterComponentProps = {
    character: CharacterProps;
    otherCharacters: CharacterProps[];
    onJoinRoom: ({character, room}: { character: CharacterProps; room: string }) => void;
    onLeaveRoom: () => void;
    currentRoom: { room: string; character: CharacterProps} | undefined;
}

const socket = io('http://localhost:3001');


export const Character = ({character, onJoinRoom,currentRoom, onLeaveRoom, otherCharacters}: CharacterComponentProps) => {

    const [interactionStatus, setInteractionStatus] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [otherCharacter, setOtherCharacter] = useState<CharacterProps>()
    const [roomId, setRoomId] = useState("")
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const eyeContainerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
            // @ts-ignore
            const { left, top, width, height } = eyeContainerRef?.current?.getBoundingClientRect();
            const eyeCenterX = left + width / 2;
            const eyeCenterY = top + height / 2;
            const deltaX = e.clientX - eyeCenterX;
            const deltaY = e.clientY - eyeCenterY;
            const angle = Math.atan2(deltaY, deltaX);
            const radius = Math.min(width, height) / 4; // Limiting the movement radius to 1/4th of eye width/height
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            setMousePosition({ x: x, y: y });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);


    const checkProximity = useCallback(() => {
        for (const otherCharacter of otherCharacters!) {
            const distance = Math.sqrt(
                Math.pow(character.position.x - otherCharacter.position.x, 2) +
                Math.pow(character.position.y - otherCharacter.position.y, 2)
            );
            if (distance < 90) {
                setInteractionStatus(true);
                setOtherCharacter(otherCharacter);
                break;
            } else {
                setInteractionStatus(false);
                setOtherCharacter(undefined);
            }
        }
    }, [otherCharacters, character.position.x, character.position.y]);

    useEffect(() => {
        checkProximity();
    }, [checkProximity]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to the server');
        });

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('connect');
            socket.off('message');
        };
    }, []);

    useEffect(() => {
        console.log(JSON.stringify(messages, null, 2));
    }, [messages]);

    const sendMessage = (message: string) => {
        socket.emit('message', {roomId, message});
    };
    const createCommonRoomName = (name1: string, name2: string) => {
        return [name1, name2].sort().join('_');
    };

    useEffect(() => {
        if (interactionStatus) {
            const room = createCommonRoomName(character.name, otherCharacter?.name!);
            socket.emit('joinRoom', {room});
            onJoinRoom({character, room});
        } else {
            socket.emit('leaveRoom', {room: createCommonRoomName(character.name, otherCharacter?.name!)});
            onLeaveRoom();
        }
        socket.on('joinedRoom', (room) => {
            setRoomId(room);
        });

        return () => {
            socket.off('joinedRoom');
        };
    }, [character.name, interactionStatus, otherCharacter?.name]);

    return (
        <>
{currentRoom?.character.id === character.id &&<div style={{
    position: 'absolute',
    left: character.position.x,
    top: character.position.y,}}>
    <Image  src={chat} alt={"chatting..."} className={" "} height={24}
            width={24}/>
</div>}
            <div
                style={{
                    position: 'absolute',
                    left: character.position.x,
                    top: character.position.y,

                }}>
                <div style={{
                    width: CHARACTER_WIDTH,
                    height: CHARACTER_HEIGHT,
                    backgroundColor: character.color ,
                }} onClick={() => sendMessage('Hello from ' + character.name)}
                     className={"relative group  p-2 rounded   border-2 border-black"}>
                    <div
                        className={"text-[9px] hidden group-hover:block duration-150  font-bold"}> {character.name}</div>

                    <div className="eye-container absolute" ref={eyeContainerRef}>
                        <div className="eye">
                            <div className="pupil" style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}></div>
                        </div>
                        <div className="eye">
                            <div className="pupil" style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}></div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
