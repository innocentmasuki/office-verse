'use client'

import {useState} from "react";
import {RiSendPlane2Line} from "react-icons/ri";
import {gameSocket} from "@/components/game/newgame";

// @ts-ignore
export const MessageInput = ({ roomId}:{ roomId:string}) => {
    const [message, setMessage] = useState("")
    const sendMessage = (message: string) => {
        gameSocket.emit('message', {roomId, message});
    };
    return (
        <div className={"w-full flex flex-row border-t-2 border-black justify-between"}>
            <input value={message} className={"px-4 py-3"} placeholder={"Type your message..."} onChange={(e)=>setMessage(e.target.value)} type="text"/>
            <button disabled={!message} className={"bg-black disabled:bg-gray-400 px-4 text-2xl text-white"} onClick={()=> {
                sendMessage(message)
                setMessage("")
            }}><RiSendPlane2Line /></button>
        </div>
    )
}
