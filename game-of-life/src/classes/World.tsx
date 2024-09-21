import { Cell } from "./Cell";
import Stack from "./Stack";

interface WorldInterface {
    id:number,
    columns: number,
    rows: number,
    name: string,
    cells: Cell[][],
    created: Date,
    lastUpdate:Date,
    generation:number,
    image:string
    evolve(offsetX:number, offsetY:number): void,
    //setContext(ctx:CanvasRenderingContext2D): void
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
    #id: number;
    #columns: number;
    #rows: number;
    #name: string;
    #cells: Cell[][];
    #created: Date;
    #undoStack: Stack<Cell[][]>;
    #redoStack: Stack<Cell[][]>;
    lastUpdate:Date;
    generation:number;
    image:string;

    constructor(id:number, columns: number, rows: number, name: string, created:Date,cells: Cell[][], lastUpdate:Date, generation:number, image:string) {
      this.#id = id;
      this.#columns = columns;
      this.#rows = rows;
      this.#name = name;
      this.#cells = cells ? cells : this.#initialize_random();
      this.#created = created;
      this.#undoStack = new Stack<Cell[][]>;
      this.#redoStack = new Stack<Cell[][]>;
      this.lastUpdate = lastUpdate;
      this.generation = generation;
      this.image = image;
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
                 const cell: Cell = new Cell( x, y, isAlive);
                 //cell.draw();
                 row.push(cell);
                 x += 1;
             }
             newCells.push(row);
             y += 1;
             x = 0;
         }
         console.log(newCells)
         return newCells;
      }
    
      // Define getters and setters
      get id(): number {
        return this.#id;
      }

      get columns(): number {
        return this.#columns;
      }

      get created(): Date {
        return this.#created;
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

      get undoStack(): Stack<Cell[][]> {
        return this.#undoStack;
      }

      get redoStack(): Stack<Cell[][]> {
        return this.#redoStack;
      }

      evolve(): void {
        const prevState = this.#cells
        this.#undoStack.push(prevState)
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
                      return new Cell(cell.posX, cell.posY, false);
                  }
              } else {
                  if (aliveNeighbours.length === 3) {
                      return new Cell(cell.posX, cell.posY, true);
                  }
              }
              return cell;
          });
        });

        this.#cells = newCells;
      }

    undo(): void {
      if (this.#undoStack.size() > 0) {
          const lastState = this.#undoStack.pop();
          const currentState = this.#cells;
          this.#redoStack.push(currentState);

          if (lastState) {
              this.#cells = lastState;
          }
          console.log(`undo ${this.#undoStack.size()}`);
      }
    }

    redo(): void {
       if (this.#redoStack.size() > 0) {
          const lastState: Cell[][] = this.#redoStack.pop()
          const currentState = this.#cells;
          this.#undoStack.push(currentState)
          if (lastState) {
            this.#cells = lastState
          }
          console.log(`redo ${this.#redoStack.size()}`)
      }
    }

    emptyRedoStack(): void {
      this.#redoStack = new Stack<Cell[][]>;
    }

    convertToJSON(): string {
      const world:string = JSON.stringify({
        id:this.#id,
        name:this.#name,
        columns:this.#columns,
        rows:this.#rows,
        cells:this.#cells.map((row)=> row.map((cell)=>cell.convertToJSON()))
      })
      return world;
    }
    
    // Method to convert the World instance to a JSON object
    toJsonObject() {
      return {
        id: this.#id,
        generations:0,
        columns: this.#columns,
        rows: this.#rows,
        name: this.#name,
        created: this.#created,
        lastUpdate: new Date(),
        cells:this.#cells.map((row)=> row.map((cell)=>cell.convertToJSON()))
      };
  }

}