import React, { ForwardedRef, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Cell } from "../classes/Cell";
import { Context } from "../App";
import { World } from "../classes/World";
import Stack from "../classes/Stack";
import {Actions } from "./WorldPlayer";
import { useWorldContext } from "./WorldContext";
import { render } from "@testing-library/react";
import useWindowSize from "../hooks/useWindoSize";

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

interface CanvasRef {
  handleUndoRedo: (action: Actions) => void;
}

const Canvas = forwardRef<CanvasRef, propType>((props, ref) => {
  const world = useWorldContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const {width, height} = useWindowSize();

  /**I use this hook in order to call handleUndoRedo() function from parent component WorldPlayer. */
  useImperativeHandle(ref, () => ({
    handleUndoRedo(action: Actions) {
      handleUndoRedo(action);
    },
  }));

  const initializeCanvas = useCallback(() => {
    if (canvasRef.current) {
      //Set the canvas size to be 100%.
      canvasRef.current.style.width = '100%';
      canvasRef.current.style.height = '100%';
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;

      contextRef.current = canvasRef.current.getContext('2d');
      if (contextRef.current) {
        world.setContext(contextRef.current); // Set the context for all the cells in the world
        world.draw();
      }
    }
  }, [])

  //Callback function to erase and redraw the entire world on the canvas.
  const clearAndRedraw = useCallback(() => {
    if (contextRef.current) {
      contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
      world.cells.forEach((row: Cell[]) =>
          row.forEach((cell: Cell) => {
              cell.ctx = contextRef.current;
              cell.draw();
          })
      );
    }
  }, [])

  const handleResize = useCallback(() => {
    initializeCanvas();
    clearAndRedraw();
  }, [initializeCanvas, clearAndRedraw]);

  //Callback function to redraw the world when zooming in and out.
  const handleZoomChange = useCallback(() => {
    if (contextRef.current) {
        contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height);
        world.zoom(props.zoom);
        world.cells.forEach((row: Cell[]) =>
            row.forEach((cell: Cell) => {
                cell.ctx = contextRef.current;
                cell.draw();
            })
        );
    }
  }, [props.zoom]);

  useEffect(() => {
    if (props.isPlaying) {
        const intId = setInterval(evolve, props.speed);
        return () => clearInterval(intId);
    }
  }, [props.isPlaying, props.speed]);

  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  useEffect(() => {
    handleZoomChange();
  }, [props.zoom, handleZoomChange]);

  useEffect(() => {
    handleResize();
  }, [width, height]);

  const evolve = () => {
    world.evolve();
    clearAndRedraw()
    props.setGeneration(prevG => prevG + 1);// Increase the generation count
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!props.isPlaying /*&& props.isDrawing*/) {
      // Draw action implied
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        const coordX = Math.floor(clientX / (CELL_WIDTH * props.zoom));
        const coordY = Math.floor(clientY / (CELL_HEIGHT * props.zoom));
        world.cells[coordY][coordX].isAlive = !world.cells[coordY][coordX].isAlive;
        world.cells[coordY][coordX].draw();
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
    clearAndRedraw();
  };

  return (
    <React.Fragment>
      <p>{width} {height}</p>
      <canvas
        ref={canvasRef}
        style={{ display: 'block' }}
        onClick={handleCanvasClick}
      ></canvas>

    </React.Fragment>
  );
});

export default Canvas;