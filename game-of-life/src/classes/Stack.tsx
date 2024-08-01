import { Cell } from "./Cell";

interface StackInterface {
    items: Array<Cell[][]>,
    push(element:Cell[][]): void,
    pop(): Cell[][],
    peek(): Cell[][],
    isEmpty(): boolean,
    size(): number,
    clear(): void,
    printStack(): string
}

export class Stack<T> implements StackInterface{
    items: Array<Cell[][]>
    constructor() {
      this.items = [];
    }
  
    // Push element onto the stack
    push(element: Cell[][]) {
      this.items.push(element);
    }
  
    // Remove and return the top element from the stack
    pop(): Cell[][] {
      if (this.isEmpty()) {
        return []; // Stack is empty
      }
      return this.items.pop();
    }
  
    // Return the top element of the stack without removing it
    peek():Cell[][] {
      return this.items[this.items.length - 1];
    }
  
    // Check if the stack is empty
    isEmpty(): boolean {
      return this.items.length === 0;
    }
  
    // Return the size of the stack
    size(): number {
      return this.items.length;
    }
  
    // Clear the stack
    clear() {
      this.items = [];
    }
  
    // Print the elements of the stack
    printStack(): string {
      let str = "";
      for (let i = 0; i < this.items.length; i++) {
        str += this.items[i] + " ";
      }
      return str;
    }
  }

  export default Stack;