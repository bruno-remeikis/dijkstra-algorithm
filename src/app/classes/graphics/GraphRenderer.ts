import { Point } from "../../types/Point";
import { calcTrianglePoints } from "../../utils/calc";
import { Aresta } from "../graph/Aresta";
import { Grafo } from "../graph/Grafo";
import { GraphElement } from "../graph/GraphElement";
import { Vertice } from "../graph/Vertice";

export class GraphRenderer
{
    private static readonly FONT_SIZE = 14;
    private static readonly TEXT_ADJUSTMENT = 4;

    constructor(
        private ctx: CanvasRenderingContext2D,
        public grafo: Grafo
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

        for(const v of this.grafo.vertices)
        {
            for(const a of v.arestas)
            {
                // CABEÇA DA SETA DA ARESTA
                if(a.direcional)
                    this.drawArrowHead(a);

                // ARESTA
                this.drawEdge(a);

                // VALOR DA ARESTA
                this.drawEdgeValue(a);
            }

            this.drawVertex(v);
        }
    }

    private drawCircle(x: number, y: number, raio: number): void {
        this.ctx.arc(x, y, raio, 0, 2 * Math.PI);
    }

    private drawVertex(v: Vertice): void
    {
        // Vértice
        this.ctx.beginPath();
        this.ctx.fillStyle = Vertice.STYLE[v.status].color;
        this.ctx.strokeStyle = Vertice.STYLE[v.status].borderColor;
        this.ctx.lineWidth = 1;
        this.drawCircle(v.x, v.y, Vertice.raio);
        this.ctx.fill();
        this.ctx.stroke();

        // Nome dos vértice
        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        //ctx.font = 
        this.ctx.fillText(
            v.nome,
            v.x - GraphRenderer.TEXT_ADJUSTMENT,
            v.y + GraphRenderer.TEXT_ADJUSTMENT
        );
        this.ctx.closePath();
    }

    private drawEdge(a: Aresta): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = Aresta.STYLE[a.status].color;
        this.ctx.lineWidth = a.marcado ? 3 : 1;
        this.ctx.moveTo(a.origem.x, a.origem.y);
        this.ctx.lineTo(a.pontoFimLinha.x, a.pontoFimLinha.y);
        this.ctx.stroke();
    }

    private drawEdgeValue(a: Aresta): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = a.selected ? Aresta.STYLE.selected.color : 'white';
        this.drawCircle(a.pontosValor.x, a.pontosValor.y, GraphRenderer.FONT_SIZE / 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = a.selected ? 'white' : 'black';
        this.ctx.fillText(
            a.valor + '',
            a.pontosValor.x - GraphRenderer.TEXT_ADJUSTMENT,
            a.pontosValor.y + GraphRenderer.TEXT_ADJUSTMENT
        );
        this.ctx.closePath();
    }

    private drawArrowHead(a: Aresta): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = Aresta.STYLE[a.status].color;
        this.ctx.moveTo(a.pontosTriangulo[0].x, a.pontosTriangulo[0].y);
        this.ctx.lineTo(a.pontosTriangulo[1].x, a.pontosTriangulo[1].y);
        this.ctx.lineTo(a.pontosTriangulo[2].x, a.pontosTriangulo[2].y);
        this.ctx.fill();
    }
}