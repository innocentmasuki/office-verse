import {Game} from "@/components/game/newgame";
import {characters, walls} from "@/utils/data";

export default function Home() {
  return (
      <main className={"overflow-hidden h-screen w-screen"}>
        <Game characters={characters} walls={walls}/>
      </main>
  )
}
