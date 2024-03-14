import { useContext, useEffect, useRef, useState } from "react";
import { Cell } from "../classes/Cell";
import { Context } from "../App";
import { World } from "../classes/World";
import Stack from "../classes/Stack";

type propType = {
    isPlaying: boolean,
    generation: number,
    setGeneration: React.Dispatch<React.SetStateAction<number>>,
    speed: number,
    history: Stack<Cell[][]>,
    setHistory: React.Dispatch<React.SetStateAction<Stack<Cell[][]>>>,
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

    //Function that evolves the map based on conway's rules.
    const evolve = () => {
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
    
    
    


    return(
        <canvas ref={canvasRef} width={world.columns * CELL_WIDTH} height={world.rows * CELL_HEIGHT}></canvas>
    )
}

export default Canvas;