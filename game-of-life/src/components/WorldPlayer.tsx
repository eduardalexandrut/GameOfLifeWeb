import React, { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import Stack from "../classes/Stack";
import { Cell } from "../classes/Cell";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PauseIcon from '@mui/icons-material/Pause';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useWorldContext } from "./WorldContext";

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
    const canvasRef = useRef(null);
    const world = useWorldContext();

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

    const saveWorld = async () => {
        const jsonData = world.convertToJSON();
        console.log(jsonData)
        try {
            const response = await fetch('http://localhost:5000/upload-world', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: jsonData,
            });
        
            if (response.ok) {
              console.log('File uploaded successfully');
            } else {
              console.error('Error uploading file');
            }
          } catch (error) {
            console.error('Error:', error);
          }
        };

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
                {isPlaying ? 
                    <React.Fragment>
                        <button className="startBtn" disabled>Undo</button>
                        <button className="startBtn" disabled>Redo</button>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <button className="startBtn" onClick={()=>canvasRef.current.handleUndoRedo(Actions.UNDO)}>Undo</button>
                    <   button className="startBtn" onClick={()=>canvasRef.current.handleUndoRedo(Actions.REDO)}>Redo</button>
                    </React.Fragment>
            }
                    
                </div>
                {/*
                <button className="startBtn" id="showgridBtn">
                    Show Grid
                </button>
                */}
                {isPlaying ? 
                    <button id="saveBtn" disabled>Save</button>
                    :
                    <button id="saveBtn" onClick={saveWorld}>Save</button>
                }
                
            </div>
            <Canvas 
                ref = {canvasRef}
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