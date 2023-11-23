'use client'

import {useEffect, useRef, useState} from "react";
import {RiSendPlane2Line} from "react-icons/ri";
import {gameSocket} from "@/components/game/newgame";
import { CharacterProps } from "./character";

// @ts-ignore
export const MessageInput = ({ roomId,user}:{ roomId:string;user:CharacterProps}) => {
    const [message, setMessage] = useState("")
    const inputBox = useRef(null)
    const sendMessage = (message: string) => {
        gameSocket.emit('sendMessage', {room:roomId, message:{message,sender:user}});
        setMessage("")
        if(inputBox.current){
            // @ts-ignore
            inputBox.current.focus()
        }
    };

    useEffect(()=>{
        if(inputBox.current){
            // @ts-ignore
            inputBox.current.focus()
        } 
    },[])
    return (
        <div className={"w-full flex flex-row border-t-2 border-black justify-between"}>
            <input ref={inputBox} onKeyUp={(e)=>{
                if(e.key === "Enter" && message.trim() && roomId){
                    sendMessage(message)
                }
            }} value={message} className={"px-4 py-3 w-full"} placeholder={"Type your message..."} onChange={(e)=>setMessage(e.target.value)} type="text"/>
            <button disabled={!message.trim() || !roomId} className={"bg-black disabled:bg-gray-400 px-4 text-2xl text-white"} onClick={()=> {
                sendMessage(message)
            }}><RiSendPlane2Line /></button>
        </div>
    )
}
