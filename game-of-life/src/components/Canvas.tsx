import React, { ForwardedRef, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { Cell } from "../classes/Cell";
import { Context } from "../App";
import { World } from "../classes/World";
import Stack from "../classes/Stack";
import {Actions, Tools } from "./WorldPlayer";
import { useWorldContext } from "./WorldContext";
import { render } from "@testing-library/react";
import useWindowSize from "../hooks/useWindowSize";

type propType = {
    isPlaying: boolean,
    generation: number,
    setGeneration: React.Dispatch<React.SetStateAction<number>>,
    speed: number,
    history: Stack<Cell[][]>,
    setHistory: React.Dispatch<React.SetStateAction<Stack<Cell[][]>>>,
    historyAction: Actions
    isDrawing: boolean,
    currentZoom: number,
    prevZoom:number,
    tool: Tools
}
const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;

interface CanvasRef {
  handleUndoRedo: (action: Actions) => void;
}

const Canvas = forwardRef<CanvasRef, propType>((props, ref) => {
  const world = useWorldContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const {width, height} = useWindowSize();
  const [zoomOffset, setZoomOffset] = useState({x:0,y:0})
  const [offset, setOffset] = useState({x:0,y:0});
  const [dragStart, setDragStart] = useState({x:0,y:0});
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  /**I use this hook in order to call handleUndoRedo() function from parent component WorldPlayer. */
  useImperativeHandle(ref, () => ({
    handleUndoRedo(action: Actions) {
      handleUndoRedo(action);
    },
  }));
  
  useEffect(() => {
      if (props.isPlaying) {
          const intId = setInterval(evolve, props.speed);
          return () => clearInterval(intId);
      }
  }, [props.isPlaying, props.speed]);
  
  useEffect(() => {
      handleZoom();
  }, [props.currentZoom]);
  
  useEffect(() => {
      handleResize();
  }, [width, height]);

  /**Function to draw the cells on the canvas, based on the offset and the currentZoom. */
  const draw = (size:number, offsetX:number, offsetY:number, currentZoom:number) => {
    if(canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height)
      world.cells.forEach(row=>{
        row.forEach(cell => {
          const drawX = (cell.posX * size - offsetX -  zoomOffset.x) * currentZoom;
          const drawY = (cell.posY * size - offsetY - zoomOffset.y) * currentZoom;
  
          if (cell.isAlive) {
              contextRef.current.fillStyle = '#D9D9D9';
              contextRef.current.strokeStyle = '#011930' //'#00072D';
          } else {
              contextRef.current.fillStyle = '#011930'//'#00072D';
              contextRef.current.strokeStyle = '#D9D9D9';
          }
          contextRef.current.strokeRect(drawX, drawY, size * currentZoom, size * currentZoom);
          contextRef.current.fillRect(drawX, drawY, size * currentZoom, size * currentZoom);
        })
      })
    }
  }

  //This function updates the canvas width and height, and then updates the context within the cells.
  const initializeCanvas = () => {
    if (canvasRef.current) {
      //Set the canvas size to be 100%.
      canvasRef.current.style.width = '100%';
      canvasRef.current.style.height = '85%';
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;

      contextRef.current = canvasRef.current.getContext('2d');
      if (contextRef.current) {
       // world.setContext(contextRef.current); // Set the context for all the cells in the world
        draw(CELL_HEIGHT, offset.x, offset.y, props.currentZoom);
      }
    }
  }

  const handleResize = () => {
    console.log("resize")
    const worldMid = (world.cells.length * CELL_WIDTH * props.currentZoom)/ 2;
    const canvasMidX = canvasRef.current.width / 2;
    const canvasMidY = canvasRef.current.height / 2;
    setOffset({x: worldMid - canvasMidX, y: worldMid - canvasMidY});
    initializeCanvas();
    //requestAnimationFrame(() =>draw(CELL_HEIGHT, worldMid - canvasMidX, worldMid - canvasMidY, props.currentZoom))
  };


  const handleZoom = () => {
    console.log("currentZoom")
    if (canvasRef.current && contextRef.current) {
      const scaledWidth = canvasRef.current.width * props.currentZoom;
      const scaledHeight = canvasRef.current.height * props.currentZoom;

      const scaledOffsetX = (scaledWidth - canvasRef.current.width) / 2;
      const scaledOffsetY = (scaledHeight - canvasRef.current.width) / 2;
      setZoomOffset({x:scaledOffsetX, y:scaledOffsetY})
      requestAnimationFrame(() =>draw(CELL_HEIGHT, offset.x, offset.y, props.currentZoom))
    }
  }

  const handleMouseDown = (event) => {
    if (props.tool == Tools.Move) {
      setIsDragging(true);
      setDragStart({x:event.clientX,y:event.clientY})
    }
  }

  const handleMouseMove = (event) => {
    if (isDragging) {
      console.log(`${offset.x}, ${offset.y}`)
      /**Calculate by how many pixels we have dragged along the x and y axis, counting from the starting point where we have previously clicked. */
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;

      const newOffest = {x:offset.x - dx, y: offset.y - dy}
      const worldSize = world.cells.length * CELL_WIDTH * props.currentZoom
      console.log(worldSize)
      if (newOffest.x > -50 && newOffest.y > -50 && newOffest.x < worldSize - canvasRef.current.width + 50 && newOffest.y < worldSize - canvasRef.current.height + 50) {
        setOffset((prevOffset) => ({
          x: prevOffset.x - dx,
          y: prevOffset.y - dy
         }))
        }
        /**Reset the new starting point as the last point to which we dragged, for the next drag. Redraw the canvas. */
        setDragStart({x:event.clientX, y:event.clientY})
        requestAnimationFrame(() =>draw(CELL_HEIGHT, offset.x, offset.y, props.currentZoom))

    }
  }

  const handleMouseUp = () => {
    setIsDragging(false);
  }


  const evolve = () => {
    world.evolve();
    requestAnimationFrame(() =>draw(CELL_HEIGHT, offset.x, offset.y, props.currentZoom))
    props.setGeneration(prevG => prevG + 1);// Increase the generation count
  };
  

  

  const handleCanvasClick = (e: React.MouseEvent) => {
    //Draw action.
    if (!props.isPlaying && props.tool == Tools.Draw) {
      if (canvasRef.current && contextRef.current) {
        console.log(offset)
        //Get x, y coordinates of the users' click, taking into account the offset and the currentZoom.
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = (e.clientX - rect.left + offset.x)/ props.currentZoom;
        const clientY = (e.clientY - rect.top + offset.y) / props.currentZoom;
        
        //Get the i, j indexes of the corresponding cell.
        const coordX = Math.floor(clientX / CELL_WIDTH * props.currentZoom);
        const coordY = Math.floor(clientY / CELL_HEIGHT * props.currentZoom);

        //Select the clicked cell and change isAlive field.
        const cell = world.cells[coordY][coordX];
        cell.isAlive = !cell.isAlive;

        //Redraw the clicked cell.
        draw(CELL_HEIGHT, offset.x, offset.y, props.currentZoom);
        world.emptyRedoStack();
      }
    }
  };

  const handleUndoRedo = (action: Actions) => {
    if (action === Actions.UNDO && props.generation > 0) {
      props.setGeneration(prevGeneration => prevGeneration - 1);
      world.undo();
    } else if (action === Actions.REDO && props.generation < (world.redoStack.size() + world.undoStack.size())) {
      props.setGeneration(prevGeneration => prevGeneration + 1);
      world.redo();
    }
    draw(CELL_HEIGHT, offset.x, offset.y, props.currentZoom)
  };

  return (
    <React.Fragment>
      <canvas
        ref={canvasRef}
        style={{display: 'block',cursor: isDragging ? 'grabbing' : 'grab' }}
        onClick={handleCanvasClick}
        onMouseMove={(event)=>handleMouseMove(event)}
        onMouseDown={(event) => handleMouseDown(event)}
        onMouseUp={handleMouseUp}
      ></canvas>

    </React.Fragment>
  );
});

export default Canvas;