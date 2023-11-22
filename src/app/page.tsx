import {Game} from "@/components/game/newgame";
import {characters, walls} from "@/utils/data";

export default function Home() {
  return (
      <main className={"h-full w-full"}>
        <Game characters={characters} walls={walls}/>
      </main>
  )
}
