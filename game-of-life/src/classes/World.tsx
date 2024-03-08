import { Cell } from "./Cell";

interface WorldInterface {
    width: number,
    height: number,
    name: string,
    cells: Cell[][]
}

export class World implements WorldInterface{
    #width: number;
    #height: number;
    #name: string;
    #cells: Cell[][];

    constructor(width: number, height: number, name: string) {
        this.#width = width;
        this.#height = height;
        this.#name = name;
        this.#cells = this.#initialize_random();
      }
      
      #initialize_random(): Cell[][] {
         //Create the 2d matrix of cells.
         let x = 0;
         let y = 0;
         const newCells: Cell[][] = [];
         //Create the 2d matrix of cells with random alive and dead cells.
         for (let i = 0; i < this.width; i++) {
             const row: Cell[] = [];
             for (let j = 0; j < this.height; j++) {
                 // Generate a random boolean to determine if the cell is alive or dead
                 const isAlive = Math.random() > 0.8; // Adjust the probability threshold as needed
                 const cell: Cell = new Cell(this.width, this.height, x, y, isAlive);
                 //cell.draw();
                 row.push(cell);
                 x += this.width;
             }
             newCells.push(row);
             y += this.height;
             x = 0;
         }
         return newCells;
      }
    
      // Define getters and setters
      get width(): number {
        return this.#width;
      }
    
      set width(value: number) {
        this.#width = value;
      }
    
      get height(): number {
        return this.#height;
      }
    
      set height(value: number) {
        this.#height = value;
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

}