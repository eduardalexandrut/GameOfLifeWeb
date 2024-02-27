interface CellInterface  {
    width: number;
    height: number;
    posX: number;
    posY: number;
    isAlive: boolean;
    ctx: CanvasRenderingContext2D | null;
    setIsAlive(value: boolean): void;
    getIsAlive(): boolean;
    /**
     * function to draw a cell on the canvas(ctx).
     */
    draw(): void;
}
export class Cell implements CellInterface {
    width: number;
    height: number;
    posX: number;
    posY: number;
    isAlive: boolean;
    ctx: CanvasRenderingContext2D;

    constructor(width: number, height: number, posX: number, posY: number, isAlive: boolean, ctx: CanvasRenderingContext2D) {
        this.width = width;
        this.height = height;
        this.posX = posX;
        this.posY = posY;
        this.isAlive = isAlive;
        this.ctx = ctx;
    }

    setIsAlive(value: boolean): void {
        this.isAlive = value;
    }

    getIsAlive(): boolean {
        return this.isAlive;
    }

    draw(): void {
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(this.posX, this.posY, this.width, this.height);
    }
}
export{};