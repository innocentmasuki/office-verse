import { Game } from "@/components/game/newgame";
import { walls } from "@/utils/data";

export default function Home() {
  return (
    <main className={"h-full w-full"}>
      <Game walls={walls} />
      {process.env.NODE_ENV === "development" && ( <div className="fixed left-0 bottom-0 text-lg py-2 px-4 bg-red-200 text-red-950 ">
        debug
      </div>)}
     
    </main>
  );
}
