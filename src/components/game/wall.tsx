import React from "react";


export type WallProps = {
    x: number, y: number, width: number, height: number, color?: string
}
export const Wall = ({wall}: { wall:WallProps }) => {
    const {x, y, width, height, color="red"} = wall;
    return (
        <div
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width,
                height: height,
                backgroundColor: color // Adjust color as needed
            }}
        />

    )
}
