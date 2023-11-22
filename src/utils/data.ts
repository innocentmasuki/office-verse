import { CharacterProps} from "@/components/game/character";
import { WallProps} from "@/components/game/wall";

export const characters: CharacterProps[] = [
    {
        id: "1",
        position: {x: 700, y: 200},
        name: "Innocent Masuki",
    },
    {
        id: "2",
        position: {x: 700, y: 200},
        name: "Sakhile Mpugose",

    },
    {
        id: "3",
        position: {x: 300, y: 300},
        name: "Fortune Tiriboyi",

    },
    {
        id: "4",
        position: {x: 500, y: 400},
        name: "Simon Moyo",

    },
    {
        id: "5",
        position: {x: 1000, y: 300},
        name: "Tafadzwa",

    },
    {
        id: "6",
        position: {x: 900, y: 100},
        name: "Javier Goodall",

    },

]

export const walls: WallProps[] = [
    // Top border
    { x: 10, y: 10, width: 600*2, height: 10, color: 'gray'},

    // Bottom border
    { x: 10, y: 800, width: 600*2, height: 10, color: 'gray'},

    // Left border
    { x: 10, y: 10, width: 10, height: 800, color: 'gray'},

    // Right border
    { x: (600*2), y: 10, width: 10, height: 800, color: 'gray'},

    // Internal walls (adjust these as needed to create the maze pathways)
    { x: 60, y: 60, width: 10, height: 400, color: 'gray'},
    { x: 110, y: 10, width: 10, height: 350, color: 'gray'},
    { x: 150, y: 160, width: 10, height: 350, color: 'gray'},
    { x: 200, y: 10, width: 10, height: 300, color: 'gray'},
    // Add more walls as needed to complete the maze
];
