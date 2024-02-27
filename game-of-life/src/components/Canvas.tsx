import { useRef } from "react";
type propType = {
    width: number,
    height: number
}
const Canvas = (props : propType) => {
    return(
        <canvas width={props.width} height={props.height}></canvas>
    )
}

export default Canvas;