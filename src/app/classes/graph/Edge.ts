import { Point } from "../../types/Point";
import { StyleMap } from "../../types/StyleProps";
import { calcCircleIntersection, calcTrianglePoints } from "../../utils/calc";
import { GraphElement } from "./GraphElement";
import { Vertex } from "./Vertex";

export class Edge extends GraphElement
{
    public static readonly STYLE: StyleMap = {
        default:  { color: /*'#212d38'*/ '#444444', borderColor: '' },
        selected: { color: '#005EFF', borderColor: '' },
        marked:   { color: '#1A9E1A', borderColor: '' }
    };

    static readonly defaultDirectional = false;
    public static readonly valueRadius = 7;
    public static readonly TRIANGLE_BASE = 12;
    public static readonly TRIANGLE_HEIGHT = 12;
    
    private _vertexIntersectionPoint: Point = { x: 0, y: 0 };
    private _endLinePoint: Point = { x: 0, y: 0 };
    private _trianglePoints: Point[] = [];
    private _valuePoint: Point = { x: 0, y: 0 };

    constructor(
        public origin: Vertex,
        public target: Vertex,
        public value: number = 1,
        public directional: boolean = Edge.defaultDirectional,
    ) {
        super();
        this.recalculate();
    }

    get vertexIntersectionPoint(): Point { return this._vertexIntersectionPoint; }

    get endLinePoint(): Point { return this._endLinePoint; }

    get trianglePoints(): Point[] { return this._trianglePoints; }

    get valuePoint(): Point { return this._valuePoint; }

    public hovers(x: number, y: number): boolean
    {
        const distancia = Math.sqrt((this.valuePoint.x - x) ** 2 + (this.valuePoint.y - y) ** 2);
        return distancia <= Edge.valueRadius;
    }

    public recalculate(): void {
        // Calcula o ponto de intersecção entre o círculo (Vértice) e a reta origem-destino
        this._vertexIntersectionPoint = calcCircleIntersection(
            { x: this.target.x, y: this.target.y },
            Vertex.radius,
            { x: this.origin.x, y: this.origin.y }
        );

        this._valuePoint = {
            x: (this.origin.x + this.vertexIntersectionPoint.x) / 2,
            y: (this.origin.y + this.vertexIntersectionPoint.y) / 2
        };

        if(this.directional) {
            // Calcula os pontos do triângulo que forma a cabeça da seta
            const { pontosTriangulo, pontoCentroBase } = calcTrianglePoints(
                { x: this.origin.x, y: this.origin.y },
                { x: this.vertexIntersectionPoint.x, y: this.vertexIntersectionPoint.y },
                Edge.TRIANGLE_HEIGHT, Edge.TRIANGLE_BASE
            );

            this._trianglePoints = pontosTriangulo;

            // Sobrescreve a variável para que a linha não passe por baixo da cabeça da seta
            this._endLinePoint = { x: pontoCentroBase.x, y: pontoCentroBase.y };
        }
        else {
            // Define o fim da linha da edge, para caso ela tenha uma cabeça de seta
            this._endLinePoint = {
                x: this.vertexIntersectionPoint.x,
                y: this.vertexIntersectionPoint.y
            };
        }
    }

    public toString(): string
    {
        return `${this.origin.name} ${this.directional ? '-' : '<'}--> ${this.target.name} (value: ${this.value})`;
    }
}