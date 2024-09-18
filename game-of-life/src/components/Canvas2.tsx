import React, { ForwardedRef, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { Cell } from "../classes/Cell";
import { Context } from "../App";
import { World } from "../classes/World";
import Stack from "../classes/Stack";
import {Actions, Tools } from "./WorldPlayer";
import { useSetWorldContext, useWorldContext } from "./WorldContext";
import { render } from "@testing-library/react";
import useWindowSize from "../hooks/useWindowSize";

type propType = {
    isPlaying: boolean,
    generation: number,
    setGeneration: React.Dispatch<React.SetStateAction<number>>,
    setZoom: React.Dispatch<React.SetStateAction<number>>,
    speed: number,
    history: Stack<Cell[][]>,
    setHistory: React.Dispatch<React.SetStateAction<Stack<Cell[][]>>>,
    historyAction: Actions
    isDrawing: boolean,
    zoom: number,
    tool: Tools
}
const DEF_CELL_WIDTH = 50;
const DEF_CELL_HEIGHT = 50;

interface CanvasRef {
  handleUndoRedo: (action: Actions) => void;
}

const Canvas2 = forwardRef<CanvasRef, propType>((props, ref) => {
    const world = useWorldContext();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const {width, height} = useWindowSize();
    const [zoomOffset, setZoomOffset] = useState({x:0,y:0})
    const [offset, setOffset] = useState({x:0,y:0});
    const [dragStart, setDragStart] = useState({x:0,y:0});
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const[action, setAction] = useState(0);
    const {updateWorldGenerations} = useSetWorldContext();

    /**I use this hook in order to call handleUndoRedo() function from parent component WorldPlayer. */
    useImperativeHandle(ref, () => ({
        handleUndoRedo(action: Actions) {
          handleUndoRedo(action);
        },
    }));


    useLayoutEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth ;
            canvasRef.current.height = window.innerHeight;
            contextRef.current = canvasRef.current.getContext("2d");

            contextRef.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)

            //Calculate the zoom offset by comparing the zoomed canvas and the actual size of the canvas.
            const scaleWidth = canvasRef.current.width * props.zoom;
            const scaleHeight = canvasRef.current.height * props.zoom;

            const scaledOffsetX = (scaleWidth - canvasRef.current.width)/2;
            const scaledOffsetY = (scaleHeight - canvasRef.current.height) / 2;
            setZoomOffset({x:scaledOffsetX, y:scaledOffsetY});

            contextRef.current.save()
            contextRef.current.translate(offset.x * props.zoom - scaledOffsetX, offset.y * props.zoom - scaledOffsetY)
            contextRef.current.scale(props.zoom, props.zoom)
            draw(DEF_CELL_WIDTH, props.zoom);
            //updateWorldGenerations(props.generation);
            contextRef.current.restore();
        }
       //contextRef.current.clearRect(0,0, world.cells.length * DEF_CELL_WIDTH * props.zoom, world.cells.length * DEF_CELL_WIDTH * props.zoom)
    }, [props.generation, props.speed, offset, props.zoom, action]);

    useEffect(() => {
    console.log("evolve")
        if (props.isPlaying) {
            const intId = setInterval(evolve, props.speed);
            return () => clearInterval(intId);
        }
    },[props.isPlaying, props.speed])

    /**Function to draw the cells on the canvas, based on the offset and the zoom. */
  const draw = (size:number, zoom:number) => {
    if(canvasRef.current && contextRef.current) {
      //contextRef.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height)
      world.cells.forEach(row=>{
        row.forEach(cell => {
          const drawX = (cell.posX * size) * zoom;
          const drawY = (cell.posY * size) * zoom;
  
          if (cell.isAlive) {
              contextRef.current.fillStyle = '#D9D9D9';
              contextRef.current.strokeStyle = '#011930' //'#00072D';
          } else {
              contextRef.current.fillStyle = '#011930'//'#00072D';
              contextRef.current.strokeStyle = '#D9D9D9';
          }
          contextRef.current.strokeRect(drawX, drawY, size * zoom, size * zoom);
          contextRef.current.fillRect(drawX, drawY, size * zoom, size * zoom);
        })
      })
    }
  }

  const evolve = () => {
    world.evolve();
    props.setGeneration(prevG => prevG + 1);// Increase the generation count
  };

  const handleMouseDown = (event) => {
    if (props.tool == Tools.Move) {
      setIsDragging(true);
      setDragStart({x:event.clientX,y:event.clientY})
    }
  }

    const handleMouseMove = (event) => {
        if (isDragging) {
        /**Calculate by how many pixels we have dragged along the x and y axis, counting from the starting point where we have previously clicked. */
        const {clientX, clientY} = getMouseCoordinates(event);
        const dx = event.clientX - dragStart.x;
        const dy = event.clientY - dragStart.y;

        //if (newOffest.x > -50 && newOffest.y > -50 && newOffest.x < worldSize - canvasRef.current.width + 50 && newOffest.y < worldSize - canvasRef.current.height + 50) {
            setOffset((prevOffset) => ({
            x: Math.floor(prevOffset.x + dx/ props.zoom),
            y: Math.floor(prevOffset.y + dy/ props.zoom)
            }))
        // }
            /**Reset the new starting point as the last point to which we dragged, for the next drag. Redraw the canvas. */
            setDragStart({x:event.clientX, y:event.clientY})
        } 
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    }

    //Function to handle the undo and redo actions.
    const handleUndoRedo = (action: Actions) => {
        if (action === Actions.UNDO && props.generation > 0) {
          props.setGeneration(prevGeneration => prevGeneration - 1);
          world.undo();
        } else if (action === Actions.REDO && props.generation < (world.redoStack.size() + world.undoStack.size())) {
          props.setGeneration(prevGeneration => prevGeneration + 1);
          world.redo();
        }
      };

      const handleCanvasClick = (e: React.MouseEvent) => {
        //Draw action.
        if (!props.isPlaying && props.tool == Tools.Draw) {
          if (canvasRef.current && contextRef.current) {
            //Get x, y coordinates of the users' click, taking into account the offset and the currentZoom.
            const rect = canvasRef.current.getBoundingClientRect()
            //const {clientX, clientY} = getMouseCoordinates(e);
            const coordX = Math.floor((e.clientX - rect.left - offset.x * props.zoom) / DEF_CELL_WIDTH * props.zoom);
            const coordY = Math.floor((e.clientY - rect.top - offset.y * props.zoom) / DEF_CELL_HEIGHT * props.zoom);
            console.log(`x:${coordX}`)
            /*const clientX = e.clientX - rect.left 
            const clientY = e.clientY - rect.top 

            // Apply any canvas transformations
            const transformedX = (clientX - offset.x * props.zoom )/ props.zoom;
            const transformedY = (clientY - offset.y * props.zoom )/props.zoom;
            
            //Get the i, j indexes of the corresponding cell.
            const coordX = Math.floor(transformedX / DEF_CELL_WIDTH);
            const coordY = Math.floor(transformedY/ DEF_CELL_HEIGHT);*/
    
            //Select the clicked cell and change isAlive field.
            if ((coordX >= 0 || coordX <= world.columns) && (coordY >= 0 || coordY <= world.rows)) {
              const cell = world.cells[coordY][coordX];
              cell.isAlive = !cell.isAlive;
      
              //Redraw the clicked cell.
              world.emptyRedoStack();
              setAction((pAction) => pAction+1)
            }
          }
        }
      };
    
    const handleWheel = (e:React.WheelEvent) => {
      e.preventDefault()
      const zoomDirection = e.deltaY > 0 ? 0.1 : - 0.1;
      const newZoom = Math.min(Math.max(props.zoom + zoomDirection,0.1), 3);
      props.setZoom(newZoom);
    }


    //Function that returns the true client.x, client.y after taking into consideration zoom and pan.
    const getMouseCoordinates = (event) => {
        const clientX = (event.clientX - offset.x /** props.zoom*/ + zoomOffset.x) /// props.zoom;
        const clientY = (event.clientY - offset.y /* props.zoom*/ + zoomOffset.y) /// props.zoom;
        return {clientX, clientY}
    }

    
    return (
        <React.Fragment>
        <p>ZoomOffset: {zoomOffset.x} {zoomOffset.y}</p>
        <p>Offset: {offset.x} {offset.y}</p>
        <p>x: {} y: {} alive: {}</p>
          <canvas
            ref={canvasRef}
            style={{display: 'block',cursor: isDragging ? 'grabbing' : 'grab' }}
            onClick={handleCanvasClick}
            onMouseMove={(event)=>handleMouseMove(event)}
            onMouseDown={(event) => handleMouseDown(event)}
            onMouseUp={handleMouseUp}
            onMouseLeave={()=>setIsDragging(false)}
            onWheel={(event)=>handleWheel(event)}
          ></canvas>
    
        </React.Fragment>
      );
    });
    
export default Canvas2;