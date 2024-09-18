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
import { Container,Row, Col } from "react-bootstrap";
import e from "express";
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
        const jsonData = world.convertToJSON();
        console.log(jsonData)
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
            <Row className="h-30 d-flex flex-row justify-content-between align-items-center">
                <Col>
                    <button className="startBtn" onClick = {(e)=>handleIsPlaying(e.target)}>Start</button>
                </Col>
                <Col>
                    <div id="genBox">
                        <ul>
                            <li>{generation}</li>
                            <li>Generation</li>
                        </ul>
                    </div>
                </Col>
                <Col className="d-flex flex-row align-items-center justify-content-around">
                        <button className="control-btn" onClick={()=>decreaseSpeed()}>-</button>
            
                            <ul>
                                <li>{speed}<span> ms</span></li>
                                <li>Speed</li>
                            </ul>
                    
                        <button className="control-btn" onClick={()=>increaseSpeed()}>+</button>
                </Col>
                <Col className="d-flex flex-row align-items-center justify-content-around">
                        <button className="control-btn" onClick={()=>handleZoom(-0.1)}>-</button>
                
                            <ul>
                                <li>{Math.round(zoom * 100)} <span>%</span></li>
                                <li>Zoom</li>
                            </ul>
                    
                        <button className="control-btn" onClick={()=>handleZoom(0.1)}>+</button>

                </Col>
                <Col>
                    {isPlaying ? 
                        <React.Fragment>
                            <button className="startBtn" disabled>Undo</button>
                            <button className="startBtn" disabled>Redo</button>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <button className="startBtn" onClick={()=>canvasRef.current.handleUndoRedo(Actions.UNDO)}>Undo</button>
                            <button className="startBtn" onClick={()=>canvasRef.current.handleUndoRedo(Actions.REDO)}>Redo</button>
                        </React.Fragment>
                }
                </Col>
                <Col>
                    <select onChange={(event) => handleSetTool(event)} className="form-select">
                        <option value={Tools.Draw}>Draw</option>
                        <option value={Tools.Move}>Move</option>
                    </select>                
                </Col>
                <Col>
                    {isPlaying ? 
                        <button id="saveBtn" disabled>Save</button>
                        :
                        <button id="saveBtn" onClick={saveWorld}>Save</button>
                    }
                </Col>
            </Row>

                    <Canvas2 
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
                        setZoom = {setZoom}
                        tool = {tool}
                       
                    />
      
      </React.Fragment>
    )
}

export default WorldPlayer;