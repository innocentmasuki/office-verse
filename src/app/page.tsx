import {Game} from "@/components/game/newgame";
import { walls} from "@/utils/data";

export default function Home() {
  return (
      <main className={"h-full w-full"}>
        <Game  walls={walls}/>
      </main>
  )
}
