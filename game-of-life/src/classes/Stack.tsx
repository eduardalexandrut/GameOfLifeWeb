import { Cell } from "./Cell";

interface StackInterface<T> {
    items: Array<T>,
    push(element:T): void,
    pop(): T | string,
    peek(): T,
    isEmpty(): boolean,
    size(): number,
    clear(): void,
    printStack(): string
}

export class Stack<T> implements StackInterface<T>{
    items: T[]
    constructor() {
      this.items = [];
    }
  
    // Push element onto the stack
    push(element) {
      this.items.push(element);
    }
  
    // Remove and return the top element from the stack
    pop(): T | string {
      if (this.isEmpty()) {
        return "Underflow"; // Stack is empty
      }
      return this.items.pop();
    }
  
    // Return the top element of the stack without removing it
    peek():T {
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