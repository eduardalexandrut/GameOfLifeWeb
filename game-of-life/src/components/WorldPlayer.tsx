import { useEffect, useState } from "react";
import Canvas from "./Canvas";

const WorldPlayer = (props:any) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const handleIsPlaying = (button) => {
        setIsPlaying((prevPlay) =>!prevPlay);
        button.innerText = isPlaying ? "Start" : "Stop";
    }
    return (
        <div>
            <div>
                <button onClick = {(e)=>handleIsPlaying(e.target)}>Start</button>
            </div>
            <Canvas isPlaying={isPlaying}/>
        </div>
    )
}

export default WorldPlayer;