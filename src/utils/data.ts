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
        position: {x: 100, y: 30},
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
        position: {x: 90, y: 710},
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

    // Right-top border
    { x: (600*2), y: 10, width: 10, height: 450, color: 'gray'},

    // Right-bottom  border
    { x: (600*2) , y: 600, width: 10, height: 200, color: 'gray'}, 



    // Innocents Desk Bottom right
    { x: 940, y: 630, width: 130*2, height: 80, color: 'white'},

    // Javier's Desk Bottom Left
    { x: 20, y: 630, width: 130*2, height: 80, color: 'white'},

    // Sakhile's Desk Top Left
    { x: 20, y: 100, width: 130*2, height: 80, color: 'white'},

];
