import { useEffect, useRef, useState } from "react";
import { Cell } from "../classes/Cell";
const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;
const IS_ALIVE = false;

type propType = {
    width: number,
    height: number
}


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
        for(let i = 0; i <= props.width; i++) {
            const row: Cell[] = [];
            for(let j = 0; j <= props.height; j++) {
                const cell: Cell = new Cell(CELL_WIDTH, CELL_HEIGHT, x, y, IS_ALIVE, contextRef.current!);
                cell.draw();
                row.push(cell)
                x += 50;
            }
            newCells.push(row);
            y += 50;
            x = 0;
        }
        setCells(newCells);
        console.log(cells)
    }, []);

    //Function that evolves the map based on conway's rules.
    const evolve = () => {
        cells.forEach((row:Cell[]) => {
            row.forEach((cell:Cell) => {
                
            });
        });
    }

    return(
        <canvas ref={canvasRef} width={props.width * CELL_WIDTH} height={props.height * CELL_WIDTH}></canvas>
    )
}

export default Canvas;