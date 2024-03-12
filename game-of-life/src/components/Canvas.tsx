import { useEffect, useRef, useState } from "react";
import { Cell } from "../classes/Cell";

type propType = {
    width: number,
    height: number
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



const Canvas = (props : propType) => {
    const [cells, setCells] = useState<Cell[][]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>();
    
    useEffect(() => {
        if (canvasRef.current) {
            contextRef.current = canvasRef.current.getContext('2d');
            setCells(new Array());
        }
        //Create the 2d matrix of cells.
        let x = 0;
        let y = 0;
        const newCells: Cell[][] = [];
        //Create the 2d matrix of cells with random alive and dead cells.
        for (let i = 0; i < props.width; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < props.height; j++) {
                // Generate a random boolean to determine if the cell is alive or dead
                const isAlive = Math.random() > 0.4; // Adjust the probability threshold as needed
                const cell: Cell = new Cell(CELL_WIDTH, CELL_HEIGHT, x, y, isAlive, contextRef.current!);
                cell.draw();
                row.push(cell);
                x += 50;
            }
            newCells.push(row);
            y += 50;
            x = 0;
        }
        setCells(newCells);

        //console.log(cells)

        //Set interval so that the matrix gets evolved every 1 second.
        const interval = setInterval(evolve, 300);

        return () => clearInterval(interval); //Cleanup function.
    }, []);

    //Function that evolves the map based on conway's rules.
    const evolve = () => {
        setCells(prevCells => {
            const newCells = prevCells.map((row, i) => {
                return row.map((cell, j) => {
                    //Loop over all the neighbours of each cell and find out how many are alive.
                    const aliveNeighbours: Cell[] = [];
                    relativePositions.forEach((pos) => {
                        const ni = i + pos[0];
                        const nj = j + pos[1];
                        if (ni >= 0 && ni < props.width && nj >= 0 && nj < props.height) {
                            const neighbor: Cell = prevCells[ni][nj];
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
    
            return newCells; // Return the new state value
        });
    };
    


    return(
        <canvas ref={canvasRef} width={props.width * CELL_WIDTH} height={props.height * CELL_WIDTH}></canvas>
    )
}

export default Canvas;