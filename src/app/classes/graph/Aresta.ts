import { Point } from "../../types/Point";
import { StyleMap } from "../../types/StyleProps";
import { calcCircleIntersection, calcTrianglePoints } from "../../utils/calc";
import { GraphElement } from "./GraphElement";
import { Vertice } from "./Vertice";

export class Aresta extends GraphElement
{
    public static readonly STYLE: StyleMap = {
        default:  { color: /*'#212d38'*/ '#444444', borderColor: '' },
        selected: { color: '#005EFF', borderColor: '' },
        marked:   { color: '#1A9E1A', borderColor: '' }
    };

    static readonly defaultDirecional = false;
    public static readonly raioValor = 7;
    public static readonly TRIANGLE_BASE = 12;
    public static readonly TRIANGLE_HEIGHT = 12;
    
    private _vertexIntersectionPoint: Point = { x: 0, y: 0 };
    private _pontoFimLinha: Point = { x: 0, y: 0 };
    private _pontosTriangulo: Point[] = [];
    private _pontosValor: Point = { x: 0, y: 0 };

    constructor(
        public origem: Vertice,
        public destino: Vertice,
        public valor: number = 1,
        public direcional: boolean = Aresta.defaultDirecional,
    ) {
        super();
        this.recalculate();
    }

    get vertexIntersectionPoint(): Point { return this._vertexIntersectionPoint; }

    get pontoFimLinha(): Point { return this._pontoFimLinha; }

    get pontosTriangulo(): Point[] { return this._pontosTriangulo; }

    get pontosValor(): Point { return this._pontosValor; }

    public havePoint(x: number, y: number): boolean
    {
        const distancia = Math.sqrt((this.pontosValor.x - x) ** 2 + (this.pontosValor.y - y) ** 2);
        return distancia <= Vertice.raio;
    }

    public recalculate(): void {
        // Calcula o ponto de intersecção entre o círculo (Vértice) e a reta origem-destino
        this._vertexIntersectionPoint = calcCircleIntersection(
            { x: this.destino.x, y: this.destino.y },
            Vertice.raio,
            { x: this.origem.x, y: this.origem.y }
        );

        this._pontosValor = {
            x: (this.origem.x + this.vertexIntersectionPoint.x) / 2,
            y: (this.origem.y + this.vertexIntersectionPoint.y) / 2
        };

        if(this.direcional) {
            // Calcula os pontos do triângulo que forma a cabeça da seta
            const { pontosTriangulo, pontoCentroBase } = calcTrianglePoints(
                { x: this.origem.x, y: this.origem.y },
                { x: this.vertexIntersectionPoint.x, y: this.vertexIntersectionPoint.y },
                Aresta.TRIANGLE_HEIGHT, Aresta.TRIANGLE_BASE
            );

            this._pontosTriangulo = pontosTriangulo;

            // Sobrescreve a variável para que a linha não passe por baixo da cabeça da seta
            this._pontoFimLinha = { x: pontoCentroBase.x, y: pontoCentroBase.y };
        }
        else {
            // Define o fim da linha da aresta, para caso ela tenha uma cabeça de seta
            this._pontoFimLinha = {
                x: this.vertexIntersectionPoint.x,
                y: this.vertexIntersectionPoint.y
            };
        }
    }

    public toString(): string
    {
        return `${this.origem.nome} ${this.direcional ? '-' : '<'}--> ${this.destino.nome} (value: ${this.valor})`;
    }
}