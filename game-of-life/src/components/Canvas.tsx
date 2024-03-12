import { useContext, useEffect, useRef, useState } from "react";
import { Cell } from "../classes/Cell";
import { Context } from "../App";
import { World } from "../classes/World";

type propType = {
    isPlaying: boolean,
    generation: number,
    setGeneration: React.Dispatch<React.SetStateAction<number>>,
    speed: number,
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
        world.evolve();
        world.setContext(contextRef.current);
        world.draw();
        //Increase the generation count.
        props.setGeneration((prevG) => prevG + 1);
    };
    
    
    


    return(
        <canvas ref={canvasRef} width={world.width * CELL_WIDTH} height={world.height * CELL_HEIGHT}></canvas>
    )
}

export default Canvas;