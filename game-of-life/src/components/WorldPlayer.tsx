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
import { Button } from "./ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Minus, Plus, Play, Square, Undo, Redo, Grid, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { viewComponentPropType } from "./WorldBuilder";
import { View } from "../App";

export enum Actions{
    UNDO,
    REDO
}

export enum Tools {
    Draw,
    Move
}

export enum MenuAction {
    SAVE,
    EXIT,
    SAVE_EXIT
}

const WorldPlayer = (props:viewComponentPropType) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(500);
    const [zoom, setZoom] = useState<number>(1);
    const [generation, setGeneration] = useState<number>(0);
    const [history, setHistory] = useState<Stack<Cell[][]>>(new Stack<Cell[][]>());
    const [historyAction, setHistoryAction] = useState<Actions| null>(null);
    const [tool, setTool] = useState<Tools>(Tools.Draw)
    const [showGrid, setShowGrid] = useState<boolean>(true);
    const canvasRef = useRef(null);
    const world = useWorldContext();
    const {updateWorldGenerations} = useSetWorldContext();

    const handleSpeed = (value:number) => {
        const newSpeed = Math.min(Math.max(speed + value, 100), 3000)
        setSpeed(newSpeed)
    }

    const handleZoom = (value:number) => {
        //Set an upper and lower bound to the zoom.
        const newZoom = Math.min(Math.max(zoom + value, 0.1), 3);
        setZoom(newZoom)
    }

    const handleMenuAction = (action:MenuAction) => {
        switch(action) {
            case MenuAction.SAVE:
                saveWorld();
                break;
            case MenuAction.EXIT:
                props.setView(View.Menu);
                break;
            case MenuAction.SAVE_EXIT:
                saveWorld();
                props.setView(View.Menu);
                break;
            default:
                saveWorld();
        }
    }

    const handleSetTool = (value: string) => {
        const selectedTool = value === "draw" ? Tools.Draw : Tools.Move;
        setTool(selectedTool);
    };

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
       {/* <div className="header-container">
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
    
        */}
        <div className="p-4 bg-background border rounded-lg shadow-md flex flex-wrap gap-4 items-center">
      <Button 
        variant={isPlaying ? "destructive" : "default"}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
        {isPlaying ? "Stop" : "Start"}
      </Button>

      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold">{generation}</span>
        <span className="text-sm text-muted-foreground">Generation</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2">
          <Button size="icon" variant="outline" onClick={() => handleZoom(-0.1)}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-16 text-center">{Math.round(zoom * 100)}%</span>
          <Button size="icon" variant="outline" onClick={() => handleZoom(0.1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">Zoom</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-2">
          <Button size="icon" variant="outline" onClick={() => handleSpeed(-100)}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-16 text-center">{speed} ms</span>
          <Button size="icon" variant="outline" onClick={() => handleSpeed(100)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">Speed</span>
      </div>

      <Select onValueChange={event => handleSetTool(event)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select tool" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draw">Draw</SelectItem>
          <SelectItem value="move">Move</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex space-x-2">
        <Button size="icon" variant="outline" onClick={()=>canvasRef.current.handleUndoRedo(Actions.UNDO)}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={()=>canvasRef.current.handleUndoRedo(Actions.REDO)}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Button 
        variant="outline" 
        onClick={() => setShowGrid(!showGrid)}
      >
        <Grid className="mr-2 h-4 w-4" />
        {showGrid ? "Hide Grid" : "Show Grid"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Actions
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={()=>handleMenuAction(MenuAction.SAVE)}>Save</DropdownMenuItem>
          <DropdownMenuItem onClick = {() => handleMenuAction(MenuAction.EXIT)}>Exit</DropdownMenuItem>
          <DropdownMenuItem onClick = {() => handleMenuAction(MenuAction.SAVE_EXIT)}>Save and Exit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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