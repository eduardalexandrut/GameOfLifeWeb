import React, { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import Stack from "../classes/Stack";
import { Cell } from "../classes/Cell";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PauseIcon from '@mui/icons-material/Pause';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSetWorldContext, useWorldContext } from "./WorldContext";
import Canvas2 from "./Canvas2";

export enum Actions{
    UNDO,
    REDO
}

export enum Tools {
    Draw,
    Move
}
const WorldPlayer = (props:any) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(500);
    const [zoom, setZoom] = useState<number>(1);
    const [generation, setGeneration] = useState<number>(0);
    const [history, setHistory] = useState<Stack<Cell[][]>>(new Stack<Cell[][]>());
    const [historyAction, setHistoryAction] = useState<Actions| null>(null);
    const [tool, setTool] = useState<Tools>(Tools.Draw)
    const canvasRef = useRef(null);
    const world = useWorldContext();
    const {updateWorldGenerations} = useSetWorldContext();

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

    const handleZoom = (value:number) => {
        //Set an upper and lower bound to the zoom.
        const newZoom = Math.min(Math.max(zoom + value, 0.1), 3);
        setZoom(newZoom)
    }


    const handleSetTool = (event) => {
        const selectedTool = parseInt(event.target.value, 10) as Tools;
        setTool(selectedTool)
    }

    const saveWorld = async () => {
        let worldJSON = world.toJsonObject();
        worldJSON.generations = generation;
        const jsonData = JSON.stringify(worldJSON);
        try {
            const response = await fetch('http://localhost:5000/add-world', {
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
        <React.Fragment>
        <div className="header-container">
            <div className="button-container">
                <button className="startBtn" onClick={(e) => handleIsPlaying(e.target)}>Start</button>
            </div>
            
            <div id="genBox" className="gen-box">
                <ul>
                    <li>{generation}</li>
                    <li>Generation</li>
                </ul>
            </div>
    
            <div className="control-container">
                <button className="control-btn" onClick={() => decreaseSpeed()}>-</button>
                <ul>
                    <li>{speed}<span> ms</span></li>
                    <li>Speed</li>
                </ul>
                <button className="control-btn" onClick={() => increaseSpeed()}>+</button>
            </div>
    
            <div className="control-container">
                <button className="control-btn" onClick={() => handleZoom(-0.1)}>-</button>
                <ul>
                    <li>{Math.round(zoom * 100)} <span>%</span></li>
                    <li>Zoom</li>
                </ul>
                <button className="control-btn" onClick={() => handleZoom(0.1)}>+</button>
            </div>
    
            <div className="undo-redo-container">
                {isPlaying ? 
                    <React.Fragment>
                        <button className="startBtn" disabled>Undo</button>
                        <button className="startBtn" disabled>Redo</button>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <button className="startBtn" onClick={() => canvasRef.current.handleUndoRedo(Actions.UNDO)}>Undo</button>
                        <button className="startBtn" onClick={() => canvasRef.current.handleUndoRedo(Actions.REDO)}>Redo</button>
                    </React.Fragment>
                }
            </div>
    
            <div className="tool-container">
                <select onChange={(event) => handleSetTool(event)} className="form-select">
                    <option value={Tools.Draw}>Draw</option>
                    <option value={Tools.Move}>Move</option>
                </select>                
            </div>
    
            <div className="save-container">
                {isPlaying ? 
                    <button id="saveBtn" disabled>Save</button>
                    :
                    <button id="saveBtn" onClick={saveWorld}>Save</button>
                }
            </div>
        </div>
    
        <Canvas2 
            ref={canvasRef}
            isPlaying={isPlaying}
            generation={generation}
            setGeneration={setGeneration}
            speed={speed}
            history={history}
            setHistory={setHistory}
            historyAction={historyAction}
            isDrawing={isDrawing}
            zoom={zoom}
            setZoom={setZoom}
            tool={tool}
        />
    </React.Fragment>
    
    )
}

export default WorldPlayer;