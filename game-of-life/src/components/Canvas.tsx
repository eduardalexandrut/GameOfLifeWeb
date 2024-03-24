import { useContext, useEffect, useRef, useState } from "react";
import { Cell } from "../classes/Cell";
import { Context } from "../App";
import { World } from "../classes/World";
import Stack from "../classes/Stack";
import { HistoryActions } from "./WorldPlayer";

type propType = {
    isPlaying: boolean,
    generation: number,
    setGeneration: React.Dispatch<React.SetStateAction<number>>,
    speed: number,
    history: Stack<Cell[][]>,
    setHistory: React.Dispatch<React.SetStateAction<Stack<Cell[][]>>>,
    historyAction:HistoryActions
    isDrawing: boolean
}
const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;

const Canvas = (props:propType) => {
    const [world, setWorld] = useContext(Context);
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
            if (props.historyAction == HistoryActions.Backward && props.generation > 0) {
                /**Get previous state and draw it. */
                props.setGeneration((prevG) => prevG - 1);
            } else if (props.historyAction == HistoryActions.Forward && props.generation < props.history.size()){
                /**Get following state and show it. */
                props.setGeneration((prevG) => prevG + 1);
            }
        }
    },[props.historyAction])

    //Function that evolves the map based on conway's rules.
    const evolve = () => {
        /*props.setHistory((prevHistory:Stack<Cell[][]>) => {
            
        })*/
        setWorld((prevWorld:World) => {
            const newCells: Cell[][] = prevWorld.evolve(); 
            
            // Redraw all cells after updating state
            newCells.forEach((row:Cell[])=>row.forEach((elem:Cell) => elem.ctx = contextRef.current))
            newCells.forEach(row => row.forEach(cell => cell.draw()));
    
            // Return a new world object with only cells updated
            const newWorld = new World(prevWorld.rows, prevWorld.columns, prevWorld.name); // Create a new World instance
            newWorld.cells = newCells; // Update just the cells field
            return newWorld;
        });

        //Increase the generation count.
        props.setGeneration((prevG) => prevG + 1);
    };
    
    //Functions that either draws on the canvas or is used to drag and move around the map.
    const handleCanvasClick = (e:React.MouseEvent) => {
        if(!props.isPlaying /*&& props.isDrawing*/) {//Draw action implied.
            const rect = canvasRef.current.getBoundingClientRect(); 
            const clientX = e.clientX - rect.left;
            const clientY = e.clientY - rect.top;
            const coordX = Math.floor(clientX / CELL_WIDTH );
            const coordY = Math.floor(clientY / CELL_HEIGHT);
            console.log(coordX, coordY)
        }
    }
    
    


    return(
        <canvas ref={canvasRef} width={world.columns * CELL_WIDTH} height={world.rows * CELL_HEIGHT} onClick={(e)=>handleCanvasClick(e)}></canvas>
    )
}

export default Canvas;