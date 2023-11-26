import React, {CSSProperties} from "react";


export type WallProps = {
    x: number, y: number, width: number, height: number, color?: string,passable?:boolean,name?:string; children?:React.ReactNode
}
export const Wall = ({wall,styles}: { wall:WallProps; styles?: CSSProperties}) => {
    const {x,children, y, width, height, color="red"} = wall;
    return (
        <div
            style={{
                ...styles,
                position: 'absolute',
                left: x,
                top: y,
                width: width,
                height: height,
                backgroundColor: color // Adjust color as needed
            }}
        >{children}</div>
    )
}
