import { StyleMap } from "../../types/StyleProps";
import { Edge } from "./Edge";
import { GraphElement } from "./GraphElement";

export class Vertex extends GraphElement
{
    public static readonly STYLE: StyleMap = {
        default:  { color: '#212d38', borderColor: 'black' },
        selected: { color: '#337EFF', borderColor: '#005EFF' },
        marked:   { color: '#21C721', borderColor: '#1A9E1A' }
    };

    private static nextIndex = 0;
    public static readonly radius = 20;

    public edges: Edge[] = [];
    public targetEdges: Edge[] = [];

    constructor(
        public _index: number,
        private _name: string,
        private _x: number = 0,
        private _y: number = 0,
    ) {
        super();
    }

    get index(): number { return this._index; }

    get name(): string { return this._name; }

    get x(): number { return this._x; }

    get y(): number { return this._y; }

    public static consumeIndex = () =>
        Vertex.nextIndex++;

    public static getLastIndex = () =>
        Vertex.nextIndex - 1;

    public static resetIndex = () =>
        Vertex.nextIndex = 0;

    static create(): Vertex | null
    {
        if(Vertex.getLastIndex() >= 25)
            return null;

        const index = Vertex.consumeIndex();
        
        return new Vertex(index, String.fromCharCode(index + 65));
    }

    public connect(vertice: Vertex, peso?: number, direcional?: boolean): Vertex
    {
        const e = new Edge(this, vertice, peso, direcional);
        this.edges.push(e);
        vertice.targetEdges.push(e);
        return this;
    }

    public setPosition(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public move(x: number, y: number) {
        this.setPosition(x, y);
        this.edges.forEach(e => e.recalculate());
        this.targetEdges.forEach(e => e.recalculate());
    }

    public hovers(x: number, y: number): boolean
    {
        const distancia = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
        return distancia <= Vertex.radius;
    }

    public hasSelectedEdge(): boolean {
        for(const e of this.edges)
            if(e.selected)
                return true;
        return false;
    }

    public static markOff(vertices: Vertex[])
    {
        for(const v of vertices)  {
            v.marked = false;
            
            for(const a of v.edges)
                a.marked = false;
        }
    }

    // deleteRelatedEdges() {
    //     this.edges = this.edges.filter(e => e.origem !== this && e.destino !== this);
    // }

    removeConnectionsWith(otherVertex: Vertex) {
        this.edges = this.edges.filter(e => e.origin !== otherVertex && e.target !== otherVertex);
    }
}