import { StyleMap } from "../../types/StyleProps";
import { Aresta } from "./Aresta";
import { GraphElement } from "./GraphElement";

export class Vertice extends GraphElement
{
    public static readonly STYLE: StyleMap = {
        default:  { color: '#212d38', borderColor: 'black' },
        selected: { color: '#337EFF', borderColor: '#005EFF' },
        marked:   { color: '#21C721', borderColor: '#1A9E1A' }
    };

    private static nextIndex = 0;
    public static readonly raio = 20;

    public arestas: Aresta[] = [];
    public targetEdges: Aresta[] = [];

    constructor(
        public _index: number,
        private _nome: string,
        private _x: number = 0,
        private _y: number = 0,
    ) {
        super();
    }

    get index(): number { return this._index; }

    get nome(): string { return this._nome; }

    get x(): number { return this._x; }

    get y(): number { return this._y; }

    public static consumeIndex = () =>
        Vertice.nextIndex++;

    public static getLastIndex = () =>
        Vertice.nextIndex - 1;

    public static resetIndex = () =>
        Vertice.nextIndex = 0;

    static criarVertice(): Vertice | null
    {
        if(Vertice.getLastIndex() >= 25)
            return null;

        const index = Vertice.consumeIndex();
        
        return new Vertice(index, String.fromCharCode(index + 65));
    }

    public conectar(vertice: Vertice, peso?: number, direcional?: boolean): Vertice
    {
        const e = new Aresta(this, vertice, peso, direcional);
        this.arestas.push(e);
        vertice.targetEdges.push(e);
        return this;
    }

    public setPosition(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public move(x: number, y: number) {
        this.setPosition(x, y);
        this.arestas.forEach(e => e.recalculate());
        this.targetEdges.forEach(e => e.recalculate());
    }

    public havePoint(x: number, y: number): boolean
    {
        const distancia = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
        return distancia <= Vertice.raio;
    }

    public haveSelectedEdge(): boolean {
        for(const e of this.arestas)
            if(e.selected)
                return true;
        return false;
    }

    public static clearMarcacoes(vertices: Vertice[])
    {
        for(const v of vertices)  {
            v.marcado = false;
            
            for(const a of v.arestas)
                a.marcado = false;
        }
    }

    // deleteRelatedEdges() {
    //     this.arestas = this.arestas.filter(e => e.origem !== this && e.destino !== this);
    // }

    removeConnectionsWith(otherVertex: Vertice) {
        this.arestas = this.arestas.filter(c => c.origem !== otherVertex && c.destino !== otherVertex);
    }
}