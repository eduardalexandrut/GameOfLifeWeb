import { useContext, useEffect, useRef, useState } from "react";
import { Cell } from "../classes/Cell";
import { Context } from "../App";
import { World } from "../classes/World";

type propType = {
    isPlaying: boolean
}
const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;
const IS_ALIVE = false;
// Define relative positions of neighbors.
const relativePositions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
];



const Canvas = (props:propType) => {
    const [world, setWorld] = useContext(Context);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>();
    
    useEffect(() => {
        if (canvasRef.current) {
            contextRef.current = canvasRef.current.getContext('2d');
            //setCells(new Array());
        }
        //Create the 2d matrix of cells.
        let x = 0;
        let y = 0;
        const newCells: Cell[][] = [];
        //Create the 2d matrix of cells with random alive and dead cells.
        for (let i = 0; i < world.width; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < world.height; j++) {
                // Generate a random boolean to determine if the cell is alive or dead
                const isAlive = Math.random() > 0.8; // Adjust the probability threshold as needed
                const cell: Cell = new Cell(CELL_WIDTH, CELL_HEIGHT, x, y, isAlive, contextRef.current!);
                cell.draw();
                row.push(cell);
                x += 50;
            }
            newCells.push(row);
            y += 50;
            x = 0;
        }
        world.cells = newCells;//setCells(newCells);

        //console.log(cells)

    }, []);

    useEffect(()=> {
        if (props.isPlaying) {
            const intId = setInterval(evolve, 500);
            return () => clearInterval(intId);
        }
    },[props.isPlaying]);

    //Function to start and stopt the interval tha updates the world.
    const handleInterval = () => {
        let interval;
        if (props.isPlaying) {
            interval = setInterval(evolve, 300);
        } else {
            clearInterval(interval);
        }
    }

    //Function that evolves the map based on conway's rules.
    const evolve = () => {
        setWorld((prevWorld:World) => {
            const newCells = prevWorld.cells.map((row, i) => {
                return row.map((cell, j) => {
                    //Loop over all the neighbours of each cell and find out how many are alive.
                    const aliveNeighbours: Cell[] = [];
                    relativePositions.forEach((pos) => {
                        const ni = i + pos[0];
                        const nj = j + pos[1];
                        if (ni >= 0 && ni < prevWorld.width && nj >= 0 && nj < prevWorld.height) {
                            const neighbor: Cell = prevWorld.cells[ni][nj];
                            if (neighbor.isAlive) {
                                aliveNeighbours.push(neighbor);
                            }
                        }
                    });
                    //Use conway's conditions to evolve the matrix of cells
                    if (cell.isAlive) {
                        if (aliveNeighbours.length < 2 || aliveNeighbours.length > 3) {
                            return new Cell(cell.width, cell.height, cell.posX, cell.posY, false, contextRef.current!);
                        }
                    } else {
                        if (aliveNeighbours.length === 3) {
                            return new Cell(cell.width, cell.height, cell.posX, cell.posY, true, contextRef.current!);
                        }
                    }
                    return cell;
                });
            });
    
            // Redraw all cells after updating state
            newCells.forEach(row => row.forEach(cell => cell.draw()));
    
            // Return a new world object with only cells updated
            const newWorld = new World(prevWorld.width, prevWorld.height, prevWorld.name); // Create a new World instance
            newWorld.cells = newCells; // Update just the cells field
            return newWorld;
        });
    };
    
    
    


    return(
        <canvas ref={canvasRef} width={world.width * CELL_WIDTH} height={world.height * CELL_WIDTH}></canvas>
    )
}

export default Canvas;