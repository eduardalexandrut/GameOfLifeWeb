import { useEffect, useState } from "react";
import Canvas from "./Canvas";

const WorldPlayer = (props:any) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(500);
    const [zoom, setZoom] = useState<number>(1);
    const [generation, setGeneration] = useState<number>(0);

    const handleIsPlaying = (button) => {
        setIsPlaying((prevPlay) =>!prevPlay);
        button.innerText = isPlaying ? "Start" : "Stop";
    }

    const increaseSpeed = () => {
        setSpeed((prevS) => prevS + 100);
    }

    const decreaseSpeed = () => {
        if (speed > 0) {
            setSpeed((prevS) => prevS - 100);
        }
    }
    return (
        <div>
            <div>
                <button onClick = {(e)=>handleIsPlaying(e.target)}>Start</button>
                <div>
                    Generation:{generation}
                </div>
                <div>
                    <button onClick={()=>increaseSpeed()}>+</button>
                    Animation Speed: {speed} ms
                    <button onClick={()=>decreaseSpeed()}>-</button>
                </div>
            </div>
            <Canvas 
                isPlaying={isPlaying}
                generation = {generation}
                setGeneration = {setGeneration}
                speed={speed}
            />
        </div>
    )
}

export default WorldPlayer;