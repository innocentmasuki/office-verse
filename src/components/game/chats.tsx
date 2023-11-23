'use client'
import {MessageInput} from "@/components/game/inputMessage";
import React from 'react';
import { CharacterProps } from "./character";

type ChatsProps = {
    roomId: string;
    user:CharacterProps;
    messages:{message:string;sender:CharacterProps}[]
}
export const Chats = ({roomId,user,messages}:ChatsProps) => {
    return (
        <div className="pb-8">
            <div className="flex flex-col pt-4 h-full overflow-auto chat-container  pb-2 overscroll-auto z-[9999]">
            {messages.map((message, index) => {
                return <div key={index}  className={`${message.sender.id === user.id ? "justify-end":"justify-start"} w-full flex flex-row`}>
                    <div className={"py-2 px-3 my-3 mx-2 text-white rounded-xl drop-shadow-md text-shadow flex flex-col justify-start"} style={{backgroundColor:message.sender.id === user.id ? user.color : message.sender.color,maxWidth:"70%"}}>
                    {message.sender.id !== user.id && <span className="font-bold text-shadow capitalize text-[9px]"> {message.sender.name}</span>}
                    {message.message}
                    </div>
                </div>
            })}
            </div>
            
            <div className={"absolute bottom-0 w-full right-0"}>
                <MessageInput user={user} roomId={roomId}/>
            </div>
        </div>
    )
}
