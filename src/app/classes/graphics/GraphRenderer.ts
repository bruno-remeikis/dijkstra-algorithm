import { Point } from "../../types/Point";
import { calcTrianglePoints } from "../../utils/calc";
import { Edge } from "../graph/Edge";
import { Graph } from "../graph/Graph";
import { GraphElement } from "../graph/GraphElement";
import { Vertex } from "../graph/Vertex";

export class GraphRenderer
{
    private static readonly FONT_SIZE = 14;
    private static readonly TEXT_ADJUSTMENT = 4;

    constructor(
        private ctx: CanvasRenderingContext2D,
        public graph: Graph
    ) {}

    rerender(): void {
        this.clear();
        this.render();
    }
    
    public clear(): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    public render(): void
    {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.font = `${GraphRenderer.FONT_SIZE}px consolas`; // sans-serif
        this.ctx.lineWidth = 1;

        for(const v of this.graph.vertices)
        {
            for(const a of v.edges)
            {
                // CABEÇA DA SETA DA ARESTA
                if(a.directional)
                    this.drawArrowHead(a);

                // ARESTA
                this.drawEdge(a);

                // VALOR DA ARESTA
                this.drawEdgeValue(a);
            }

            this.drawVertex(v);
        }
    }

    private drawCircle(x: number, y: number, radius: number): void {
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    }

    private drawVertex(v: Vertex): void
    {
        // Vértice
        this.ctx.beginPath();
        this.ctx.fillStyle = Vertex.STYLE[v.status].color;
        this.ctx.strokeStyle = Vertex.STYLE[v.status].borderColor;
        this.ctx.lineWidth = 1;
        this.drawCircle(v.x, v.y, Vertex.radius);
        this.ctx.fill();
        this.ctx.stroke();

        // Nome dos vértice
        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        //ctx.font = 
        this.ctx.fillText(
            v.name,
            v.x - GraphRenderer.TEXT_ADJUSTMENT,
            v.y + GraphRenderer.TEXT_ADJUSTMENT
        );
        this.ctx.closePath();
    }

    private drawEdge(a: Edge): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = Edge.STYLE[a.status].color;
        this.ctx.lineWidth = a.marked ? 3 : 1;
        this.ctx.moveTo(a.origin.x, a.origin.y);
        this.ctx.lineTo(a.endLinePoint.x, a.endLinePoint.y);
        this.ctx.stroke();
    }

    private drawEdgeValue(a: Edge): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = a.selected ? Edge.STYLE.selected.color : 'white';
        this.drawCircle(a.valuePoint.x, a.valuePoint.y, GraphRenderer.FONT_SIZE / 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = a.selected ? 'white' : 'black';
        this.ctx.fillText(
            a.value + '',
            a.valuePoint.x - GraphRenderer.TEXT_ADJUSTMENT,
            a.valuePoint.y + GraphRenderer.TEXT_ADJUSTMENT
        );
        this.ctx.closePath();
    }

    private drawArrowHead(a: Edge): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = Edge.STYLE[a.status].color;
        this.ctx.moveTo(a.trianglePoints[0].x, a.trianglePoints[0].y);
        this.ctx.lineTo(a.trianglePoints[1].x, a.trianglePoints[1].y);
        this.ctx.lineTo(a.trianglePoints[2].x, a.trianglePoints[2].y);
        this.ctx.fill();
    }
}