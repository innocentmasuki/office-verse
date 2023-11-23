import {WallProps} from "@/components/game/wall";


export const walls: WallProps[] = [

    // Office 01

    // Top border
    {x: 10, y: 10, width: 600 * 2, height: 10, color: 'gray'},

    // Bottom border
    {x: 10, y: 800, width: 600 * 2, height: 10, color: 'gray'},

    // Left border
    {x: 10, y: 10, width: 10, height: 800, color: 'gray'},

    // Right-top border
    {x: (600 * 2), y: -640, width: 10, height: 650, color: 'gray'},

    // Right-bottom  border
    {x: (600 * 2), y: 600, width: 10, height: 200, color: 'gray'},


    // Outside top border
    {x: (600 * 2), y: 340, width: 400 * 2, height: 10, color: 'gray'},


    // Office 02

    //  Top-left border
    {x: (1000 * 2), y: 340, width: 10, height: 120, color: 'gray'},

    // Bottom-left border
    {x: (1000 * 2), y: 600, width: 10, height: 200, color: 'gray'},

    // Top office border
    {x: (1100 * 2), y: 340, width: 350 * 2, height: 10, color: 'gray'},

    // Bottom border
    {x: (1000 * 2), y: 800, width: 450 * 2, height: 10, color: 'gray'},

    // Right border
    {x: (1450 * 2), y: 340, width: 10, height: 470, color: 'gray'},


    // Kitchen border
    {x: (1100 * 2), y: -300, width: 10, height: 650, color: 'gray'},

    {x: (1450 * 2), y: -300, width: 10, height: 650, color: 'gray'},


     // Desks in office 01

    // Innocents Desk Bottom right
    {x: 940, y: 630, width: 130 * 2, height: 80, color: 'white'},

    // Javier's Desk Bottom Left
    {x: 20, y: 630, width: 130 * 2, height: 80, color: 'white'},

    // Rubens's Desk Top Left
    {x: 20, y: 100, width: 130 * 2, height: 80, color: 'white'},

    // Tumaini's Desk
    {x: 230, y: 260, width: 220, height: 270, color: 'white'},

    // Gift's Desk
    {x: 750, y: 20, width: 220, height: 320, color: 'white'},


    // Desks in office 02
    
    {x: (1300 * 2), y: 630, width: 140, height: 170, color: 'white'},

    {x: (1120 * 2), y: 630, width: 140, height: 170, color: 'white'},

    {x: (1120 * 2), y: 350, width: 140, height: 170, color: 'white'},

    {x: (1300 * 2), y: 350, width: 140, height: 170, color: 'white'},
    

    // Outside Desk inbetween office 01 and 02
    {x: (700 * 2), y: 450, width: 260, height: 400, color: 'white'},

    // Patio Outside Desk
    {x: (300 * 2), y: 940, width: 550, height: 240, color: 'white'},


    // Swimming Pool
    {x: (500 * 2), y: (700 * 2), width: (600 * 2), height: 400, color: 'aqua', passable: true, name: 'swimming-pool'},

];



