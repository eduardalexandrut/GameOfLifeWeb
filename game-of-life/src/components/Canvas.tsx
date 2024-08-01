import { useContext, useEffect, useRef, useState } from "react";
import { Cell } from "../classes/Cell";
import { Context } from "../App";
import { World } from "../classes/World";
import Stack from "../classes/Stack";
import {Actions } from "./WorldPlayer";
import { useWorldContext } from "./WorldContext";

type propType = {
    isPlaying: boolean,
    generation: number,
    setGeneration: React.Dispatch<React.SetStateAction<number>>,
    speed: number,
    history: Stack<Cell[][]>,
    setHistory: React.Dispatch<React.SetStateAction<Stack<Cell[][]>>>,
    historyAction: Actions
    isDrawing: boolean,
    zoom: number
}
const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;

const Canvas = (props:propType) => {
    const world = useWorldContext();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>();
    
    useEffect(() => {
        if (canvasRef.current) {
            contextRef.current = canvasRef.current.getContext('2d');
            world.setContext(contextRef.current);//Set the context for all the cells in the world.   
            world.draw();   
        }
    }, []);

    useEffect(()=> {
        if (props.isPlaying) {
            const intId = setInterval(evolve, props.speed);
            return () => clearInterval(intId);
        }
    },[props.isPlaying, props.speed]);

    useEffect(() => {
        if (!props.isPlaying) {
            handleUndoRedo(props.historyAction)
        }
    },[props.historyAction])

    useEffect(() => {
        console.log("zoom")
        contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
        world.zoom(props.zoom)
        world.cells.forEach((row:Cell[]) => row.forEach((cell:Cell) => cell.ctx = contextRef.current))
        world.cells.forEach((row:Cell[]) => row.forEach((cell:Cell) => cell.draw()));
    },[props.zoom])


    //Function that evolves the map based on conway's rules.
    const evolve = () => {
        console.log(world.history.size())
        world.evolve();
        world.cells.forEach((row:Cell[]) => row.forEach((cell:Cell) => cell.ctx = contextRef.current))
        world.cells.forEach((row:Cell[]) => row.forEach((cell:Cell) => cell.draw()));

        //Increase the generation count.
        props.setGeneration((prevG) => prevG + 1);
    };
    
    //Functions that either draws on the canvas or is used to drag and move around the map.
    const handleCanvasClick = (e:React.MouseEvent) => {
        if(!props.isPlaying /*&& props.isDrawing*/) {//Draw action implied.
            const rect = canvasRef.current.getBoundingClientRect(); 
            const clientX = e.clientX - rect.left;
            const clientY = e.clientY - rect.top;
            const coordX = Math.floor(clientX / (CELL_WIDTH * props.zoom) );
            const coordY = Math.floor(clientY / (CELL_HEIGHT * props.zoom));
            world.cells[coordY][coordX].isAlive = ! world.cells[coordY][coordX].isAlive;
            world.cells[coordY][coordX].draw();
        }
    }

    //Function that handles undo/redo actions.
    const handleUndoRedo = (action:Actions) => {
        if(action == Actions.UNDO) {
            props.setGeneration(prevGeneration => prevGeneration - 1)
            world.undo()
        } else if (action == Actions.REDO) {
            props.setGeneration(prevGeneration => prevGeneration + 1)
            world.redo()
        }

        const context = contextRef.current;
        if (context) {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            world.cells.forEach((row: Cell[]) => row.forEach((cell: Cell) => {
                cell.ctx = context;
                cell.draw();
            }));
        }
    }



    return(
        <canvas ref={canvasRef} width={world.columns * CELL_WIDTH * props.zoom} height={world.rows * CELL_HEIGHT * props.zoom} onClick={(e)=>handleCanvasClick(e)}></canvas>
    )
}

export default Canvas;