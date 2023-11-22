'use client'
import React, {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import chat from "../../assets/chat.gif"
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export type CharacterProps = {
    id: string
    position: { x: number, y: number }
    name: string
    otherCharacters?: { id: string; position: { x: number, y: number }, name: string }[]
}

export const CHARACTER_HEIGHT = 70;
export const CHARACTER_WIDTH = 80;

export const Character = ({character, otherCharacters}: { character: CharacterProps; otherCharacters: CharacterProps[] }) => {

    const [interactionStatus, setInteractionStatus] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [otherCharacter, setOtherCharacter] = useState<CharacterProps>()
    const [roomId, setRoomId] = useState("")

    const checkProximity = useCallback(() => {
        for (const otherCharacter of otherCharacters!) {
            const distance = Math.sqrt(
                Math.pow(character.position.x - otherCharacter.position.x, 2) +
                Math.pow(character.position.y - otherCharacter.position.y, 2)
            );
            if (distance < 50) {
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

    const sendMessage = (message:string) => {
        socket.emit('message', {roomId, message});
    };
    const createCommonRoomName = (name1:string, name2:string) => {
        return [name1, name2].sort().join('_');
    };

    useEffect(() => {
        if (interactionStatus) {
            socket.emit('joinRoom', { room: createCommonRoomName(character.name,otherCharacter?.name!) });
        }else{
            socket.emit('leaveRoom', { room: createCommonRoomName(character.name,otherCharacter?.name!) });
        }
        socket.on('joinedRoom', (room) => {
            console.log(`Joined room: ${room}`);
            setRoomId(room);
        });

        return () => {
            socket.off('joinedRoom');
        };
    }, [ character.name, interactionStatus, otherCharacter?.name]);

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    left: character.position.x,
                    top: character.position.y,

                }}
            >
                <div style={{
                    width: CHARACTER_WIDTH,
                    height: CHARACTER_HEIGHT
                }} onClick={() => sendMessage('Hello from ' + character.name)} className={"relative group bg-gradient-to-r from-cyan-200 to-blue-200 p-2 rounded  overflow-hidden border-2 border-black"}>
                  <div className={"text-[9px] hidden group-hover:block duration-150  font-bold"}> {character.name}</div>
                    {interactionStatus &&
                        <Image src={chat} alt={"chatting..."} className={"absolute -top-0 right-0"} height={24}
                               width={24}/>}
                </div>


            </div>

        </>

    )
}
