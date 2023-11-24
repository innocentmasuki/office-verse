import { WallProps } from "@/components/game/wall";
import { erika } from "./houses/erika";

const moveHousePosition = (house: WallProps[], down: number, right: number) => {
    for (let i = 0; i < house.length; i++) {
      house[i].x = house[i].x + right;
      house[i].y = house[i].y + down;
    }
  
    return house;
  };

const moveDownAmount = 900 * 2;
const moveRightAmount = 500;

for (let i = 0; i < erika.length; i++) {
  erika[i].x = erika[i].x + moveRightAmount;
  erika[i].y = erika[i].y + moveDownAmount;
}

export const walls: WallProps[] = [
  ...moveHousePosition(erika, moveDownAmount, moveRightAmount),

];
