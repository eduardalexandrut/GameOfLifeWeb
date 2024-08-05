import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import Stack from "../classes/Stack";
import { Cell } from "../classes/Cell";

export enum Actions{
    UNDO,
    REDO
}
const WorldPlayer = (props:any) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(500);
    const [zoom, setZoom] = useState<number>(1);
    const [generation, setGeneration] = useState<number>(0);
    const [history, setHistory] = useState<Stack<Cell[][]>>(new Stack<Cell[][]>());
    const [historyAction, setHistoryAction] = useState<Actions| null>(null);

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
                <button className="startBtn" onClick = {(e)=>handleIsPlaying(e.target)}>Start</button>
                <div id="genBox">
                    <ul>
                        <li>{generation}</li>
                        <li>Generation</li>
                    </ul>
                </div>
                <div id="speedBox">
                    <button className="control-btn" onClick={()=>decreaseSpeed()}>-</button>
           
                        <ul>
                            <li>{speed}<span> ms</span></li>
                            <li>Speed</li>
                        </ul>
                   
                    <button className="control-btn" onClick={()=>increaseSpeed()}>+</button>
                </div>
                <div id="zoomBox">
                    <button className="control-btn" onClick={()=>zoomOut()}>-</button>
             
                        <ul>
                            <li>{Math.round(zoom * 100)} <span>%</span></li>
                            <li>Zoom</li>
                        </ul>
                
                    <button className="control-btn" onClick={()=>zoomIn()}>+</button>
                </div>
                <div id="undoRedoBox"> 
                    <button className="startBtn" onClick={()=>setHistoryAction(Actions.UNDO)}>Undo</button>
                    <button className="startBtn" onClick={()=>setHistoryAction(Actions.REDO)}>Redo</button>
                </div>
                <button className="startBtn" id="showgridBtn">
                    Show Grid
                </button>
                <button id="saveBtn">Save</button>
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
                zoom = {zoom}
            />
        </div>
    )
}

export default WorldPlayer;