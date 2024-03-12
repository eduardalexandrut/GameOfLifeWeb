import { Cell } from "./Cell";

interface WorldInterface {
    columns: number,
    rows: number,
    name: string,
    cells: Cell[][],
    draw(): void,
    evolve(): Cell[][],
    setContext(ctx:CanvasRenderingContext2D): void
}
const CELL_COLUMNS = 50;
const CELL_ROWS = 50;
// Define relative positions of neighbors.
const relativePositions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];


export class World implements WorldInterface{
    #columns: number;
    #rows: number;
    #name: string;
    #cells: Cell[][];

    constructor(columns: number, rows: number, name: string) {
        this.#columns = columns;
        this.#rows = rows;
        this.#name = name;
        this.#cells = this.#initialize_random();
      }
      
      #initialize_random(): Cell[][] {
         //Create the 2d matrix of cells.
         let x = 0;
         let y = 0;
         const newCells: Cell[][] = [];
         //Create the 2d matrix of cells with random alive and dead cells.
         for (let i = 0; i < this.columns; i++) {
             const row: Cell[] = [];
             for (let j = 0; j < this.rows; j++) {
                 // Generate a random boolean to determine if the cell is alive or dead
                 const isAlive = Math.random() > 0.4; // Adjust the probability threshold as needed
                 const cell: Cell = new Cell(CELL_COLUMNS, CELL_ROWS, x, y, isAlive);
                 //cell.draw();
                 row.push(cell);
                 x += 50;
             }
             newCells.push(row);
             y += 50;
             x = 0;
         }
         console.log(newCells)
         return newCells;
      }
    
      // Define getters and setters
      get columns(): number {
        return this.#columns;
      }
    
      set columns(value: number) {
        this.#columns = value;
      }
    
      get rows(): number {
        return this.#rows;
      }
    
      set rows(value: number) {
        this.#rows = value;
      }
    
      get name(): string {
        return this.#name;
      }
    
      set name(value: string) {
        this.#name = value;
      }
    
      get cells(): Cell[][] {
        return this.#cells;
      }
    
      set cells(value: Cell[][]) {
        this.#cells = value;
      }

      draw(): void {
          this.#cells.forEach((row) => row.forEach((cell) => cell.draw()));
          console.log("d")
      }

      evolve(): Cell[][] {
        const newCells = this.#cells.map((row, i) => {
          return row.map((cell, j) => {
              //Loop over all the neighbours of each cell and find out how many are alive.
              const aliveNeighbours: Cell[] = [];
              relativePositions.forEach((pos) => {
                  const ni = i + pos[0];
                  const nj = j + pos[1];
                  if (ni >= 0 && ni < this.#columns && nj >= 0 && nj < this.#rows) {
                      const neighbor: Cell = this.#cells[ni][nj];
                      if (neighbor.isAlive) {
                          aliveNeighbours.push(neighbor);
                      }
                  }
              });
              //Use conway's conditions to evolve the matrix of cells
              if (cell.isAlive) {
                  if (aliveNeighbours.length < 2 || aliveNeighbours.length > 3) {
                      return new Cell(cell.width, cell.height, cell.posX, cell.posY, false);
                  }
              } else {
                  if (aliveNeighbours.length === 3) {
                      return new Cell(cell.width, cell.height, cell.posX, cell.posY, true);
                  }
              }
              return cell;
          });
        });

        return newCells;
      }

      setContext(ctx:CanvasRenderingContext2D): void {
          this.#cells.forEach((row) =>row.forEach((cell) => cell.ctx = ctx));
      }

}