
interface CellInterface  {
    posX: number;
    posY: number;
    isAlive: boolean;
    ctx: CanvasRenderingContext2D | null;
    clone(): Cell
}
export class Cell implements CellInterface {
    #posX: number;
    #posY: number;
    #isAlive: boolean;
    #ctx: CanvasRenderingContext2D | null;

    constructor(posX: number, posY: number, isAlive: boolean) {
        this.#posX = posX;
        this.#posY = posY;
        this.#isAlive = isAlive;
        this.#ctx = null;
    }


    get posX(): number {
        return this.#posX;
    }
    set posX(value: number) {
        this.#posX = value;
    }

    get posY(): number {
        return this.#posY;
    }
    set posY(value: number) {
        this.#posY = value;
    }

    get isAlive(): boolean {
        return this.#isAlive;
    }
    set isAlive(value: boolean) {
        this.#isAlive = value;
    }

    get ctx(): CanvasRenderingContext2D | null {
        return this.#ctx;
    }
    set ctx(value: CanvasRenderingContext2D | null) {
        this.#ctx = value;
    }

    clone(): Cell {
        return new Cell(this.posX, this.posY, this.isAlive);
    }

    convertToJSON(): string {
        return JSON.stringify({
            posX: this.#posX,
            posY: this.#posY,
            isAlive: this.#isAlive,
            ctx: this.#ctx
        })
    }
}

export{};