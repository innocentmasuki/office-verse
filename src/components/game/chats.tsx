'use client'
import {MessageInput} from "@/components/game/inputMessage";

type ChatsProps = {
    messages: any[];
    roomId: string;
}
export const Chats = ({messages, roomId}:ChatsProps) => {
    return (
        <div className={" grow justify-between"}>
            {messages.map((message, index) => {
                return <div key={index}>{message}</div>
            })}
            <div className={"absolute bottom-0 w-full right-0"}>
                <MessageInput roomId={roomId}/>
            </div>
        </div>
    )
}
