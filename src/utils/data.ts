import {WallProps} from "@/components/game/wall";


export const walls: WallProps[] = [
    // Top border
    {x: 10, y: 10, width: 600 * 2, height: 10, color: 'gray'},

    // Bottom border
    {x: 10, y: 800, width: 600 * 2, height: 10, color: 'gray'},

    // Left border
    {x: 10, y: 10, width: 10, height: 800, color: 'gray'},

    // Right-top border
    {x: (600 * 2), y: 10, width: 10, height: 450, color: 'gray'},

    // Right-bottom  border
    {x: (600 * 2), y: 600, width: 10, height: 200, color: 'gray'},


    // Innocents Desk Bottom right
    {x: 940, y: 630, width: 130 * 2, height: 80, color: 'white'},

    // Javier's Desk Bottom Left
    {x: 20, y: 630, width: 130 * 2, height: 80, color: 'white'},

    // Rubens's Desk Top Left
    {x: 20, y: 100, width: 130 * 2, height: 80, color: 'white'},

];
