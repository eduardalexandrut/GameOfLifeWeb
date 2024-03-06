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
        this.#cells = [];
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