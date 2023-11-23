'use client'
import React, {useCallback, useEffect, useRef, useState} from "react";
import { PiChatTeardropDotsFill } from "react-icons/pi";

import {gameSocket} from "@/components/game/newgame";

export type CharacterProps = {
    id: string
    position: { x: number, y: number }
    name: string
    otherCharacters?: { id: string; position: { x: number, y: number }, name: string }[]
    color: string;
    gender: "male" | "female";
}

export const CHARACTER_HEIGHT = 70;
export const CHARACTER_WIDTH = 80;

type CharacterComponentProps = {
    character: CharacterProps;
    otherCharacters: CharacterProps[];
    onJoinRoom: ({characters, room}: { characters: CharacterProps[]; room: string }) => void;
    onLeaveRoom: () => void;
    currentRoom: { room: string; characters: CharacterProps[] } | undefined;
    direction: "right" | "left";
    index: number;
    onToggleChat: () => void;
}




export const Character = ({
                              character,
                              index,
                              direction,
                              onJoinRoom,
                              currentRoom,
                              onLeaveRoom,
    onToggleChat,
                              otherCharacters
                          }: CharacterComponentProps) => {

    const [interactionStatus, setInteractionStatus] = useState(false);
    const [otherCharacter, setOtherCharacter] = useState<CharacterProps>()
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const eyeContainerRef = useRef(null);


    useEffect(() => {
        const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
            // @ts-ignore
            const {left, top, width, height} = eyeContainerRef?.current?.getBoundingClientRect();
            const eyeCenterX = left + width / 2;
            const eyeCenterY = top + height / 2;
            const deltaX = e.clientX - eyeCenterX;
            const deltaY = e.clientY - eyeCenterY;
            const angle = Math.atan2(deltaY, deltaX);
            const radius = Math.min(width, height) / 4; // Limiting the movement radius to 1/4th of eye width/height
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            setMousePosition({x: x, y: y});
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);


    const checkProximity = useCallback(() => {
        const chars = otherCharacters.filter(char=>char.id !== character.id)
        for (const otherCharacter of chars!) {
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





    const createCommonRoomName = (name1: string, name2: string) => {
        return [name1, name2].sort().join('_');
    };

    useEffect(() => {
        if (interactionStatus) {
            const room = createCommonRoomName(character.name, otherCharacter?.name!);
            gameSocket.emit('joinRoom', {room});
            onJoinRoom({characters:[character,otherCharacter!], room});
        } else {
            gameSocket.emit('leaveRoom', {room: createCommonRoomName(character.name, otherCharacter?.name!)});
            onLeaveRoom();
        }
       
    }, [character.name, interactionStatus, otherCharacter?.name]);

    return (
        <>
            {currentRoom?.characters[0].id === character.id && currentRoom.characters.some(char=> char.id === character.id) && <div style={{
                position: 'absolute',
                left: character.position.x,
                top: character.position.y,
            }} onClick={onToggleChat} className={"cursor-pointer"}>
                <PiChatTeardropDotsFill  className={"-mt-[35px] ml-[70px] h-[40px] w-[40px]"}/>
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
                    backgroundColor: character.color,
                }}
                     className={`relative group  p-2 rounded-b rounded-t-2xl ${(index === 0 && direction === "left" ? "rounded-tl-3xl" : "rounded-tr-3xl")}   border-2 border-black`}>
                    <div
                        className={"text-[9px] hidden group-hover:block duration-150 truncate font-bold"}> {character.name}</div>

                    <div
                        className={`eye-container  absolute ${(index === 0 && direction === "left" ? "-left-5" : "left-0")} `}
                        ref={eyeContainerRef}>
                        <div className="eye">
                            <div className="pupil"
                                 style={{transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`}}></div>
                        </div>
                        <div className="eye">
                            <div className="pupil"
                                 style={{transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`}}></div>
                        </div>
                    </div>
                    <div
                        className={` ${character.gender === "male" ? "bg-blue-800 " : " bg-pink-800"} absolute tie h-4 w-4 ${(index === 0 && direction === "left" ? "left-[16px]" : "left-[45px]")}   bottom-[5px]`}></div>
                </div>
            </div>
        </>
    )
}
