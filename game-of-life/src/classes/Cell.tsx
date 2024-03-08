

interface CellInterface  {
    width: number;
    height: number;
    posX: number;
    posY: number;
    isAlive: boolean;
    ctx: CanvasRenderingContext2D | null;
    draw(): void;/*** function to draw a cell on the canvas(ctx).*/
}
export class Cell implements CellInterface {
    #width: number;
    #height: number;
    #posX: number;
    #posY: number;
    #isAlive: boolean;
    #ctx: CanvasRenderingContext2D | null;

    constructor(width: number, height: number, posX: number, posY: number, isAlive: boolean) {
        this.#width = width;
        this.#height = height;
        this.#posX = posX;
        this.#posY = posY;
        this.#isAlive = isAlive;
        this.#ctx = null;
    }

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

    draw(): void {
        if (!this.#ctx) {
            throw new Error('Canvas context is not set.');
        }

        this.#ctx.strokeStyle = 'black';
        this.#ctx.strokeRect(this.#posX, this.#posY, this.#width, this.#height);
        if (this.#isAlive) {
            this.#ctx.fillStyle = 'black';
        } else {
            this.#ctx.fillStyle = 'white';
        }
        this.#ctx.fillRect(this.#posX, this.#posY, this.#width, this.#height);
    }
}

export{};