import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import Stack from "../classes/Stack";
import { Cell } from "../classes/Cell";

export enum HistoryActions{
    Backward,
    Forward
}
const WorldPlayer = (props:any) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(500);
    const [zoom, setZoom] = useState<number>(1);
    const [generation, setGeneration] = useState<number>(0);
    const [history, setHistory] = useState<Stack<Cell[][]>>(new Stack<Cell[][]>());
    const [historyAction, setHistoryAction] = useState<HistoryActions| null>(null);

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
            <div id="control-panel">
                <button onClick = {(e)=>handleIsPlaying(e.target)}>Start</button>
                <div>
                    Generation:{generation}
                </div>
                <div>
                    <button onClick={()=>increaseSpeed()}>+</button>
                    Animation Speed: {speed} ms
                    <button onClick={()=>decreaseSpeed()}>-</button>
                </div>
                <div>
                    <button>Undo</button>
                    <button>Redo</button>
                </div>
                <div>
                    <button>Zoom In</button>
                    <p>100%</p>
                    <button>Zoom Out</button>
                </div>
                <button>Save</button>
            </div>
            <Canvas 
                isPlaying={isPlaying}
                generation = {generation}
                setGeneration = {setGeneration}
                speed={speed}
                history = {history}
                setHistory = {setHistory}
                historyAction={historyAction}
                isDrawing={isDrawing}
            />
        </div>
    )
}

export default WorldPlayer;