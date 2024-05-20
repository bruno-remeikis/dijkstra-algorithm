import Aresta from "./Aresta";

export default class Vertice
{
    private static nextIndex = 0;
    public static readonly raio = 20;

    public arestas: Aresta[] = [];
    public marcado: boolean = false;
    public selected: boolean = false;

    constructor(
        public index: number,
        public nome: string,
        public x: number = 0,
        public y: number = 0,
    ) {}

    public static consumeIndex = () =>
        Vertice.nextIndex++;

    public static getLastIndex = () =>
        Vertice.nextIndex - 1;

    public static resetIndex = () =>
        Vertice.nextIndex = 0;

    public conectar(vertice: Vertice, peso?: number, direcional?: boolean)
    {
        this.arestas.push(new Aresta(this, vertice, peso, direcional));
        return this;
    }

    public setPosition(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    public hasPoint(x: number, y: number): boolean
    {
        const distancia = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
        return distancia <= Vertice.raio;
    }

    public static clearMarcacoes(vertices: Vertice[])
    {
        for(const v of vertices)
        {
            v.marcado = false;
            
            for(const a of v.arestas)
                a.marcada = false;
        }
    }
}