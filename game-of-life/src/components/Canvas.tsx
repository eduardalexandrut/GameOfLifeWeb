import { useEffect, useRef, useState } from "react";
import { Cell } from "../classes/Cell";
const WIDTH = 5;
const HEIGHT = 5;
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
        for(let i = 0; i < 5; i++) {
            const row: Cell[] = [];
            for(let j = 0; j < 5; j++) {
                row.push(new Cell(WIDTH, HEIGHT, x, y, IS_ALIVE, contextRef.current!))
                x += 50;
            }
            newCells.push(row);
            y += 50;
            x = 0;
        }
        setCells(newCells);
        console.log(cells)
    }, []);
    return(
        <canvas ref={canvasRef} width={props.width} height={props.height}></canvas>
    )
}

export default Canvas;