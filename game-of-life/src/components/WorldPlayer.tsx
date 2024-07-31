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

    const zoomIn = () => {
        setZoom(prevZoom => prevZoom + 0.1)
    }

    const zoomOut = () => {
        if (zoom > 0.2) {
            setZoom( prevZoom => prevZoom - 0.1)
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
                    <button onClick={()=>decreaseSpeed()}>-</button>
                    Animation Speed: {speed} ms
                    <button onClick={()=>increaseSpeed()}>+</button>
                </div>
                <div>
                    <button>Undo</button>
                    <button>Redo</button>
                </div>
                <div>
                    <button onClick={()=>zoomIn()}>Zoom In</button>
                    <p>{Math.round(zoom * 100)}%</p>
                    <button onClick={()=>zoomOut()}>Zoom Out</button>
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