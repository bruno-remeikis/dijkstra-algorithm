import { Vertice } from "./Vertice";

export class Aresta
{
    static readonly defaultDirecional = false;
    //static readonly raioValor = 7;

    public marcada: boolean = false;

    //public xValor: number;
    //public yValor: number;

    constructor(
        public origem: Vertice,
        public destino: Vertice,
        public valor: number = 1,
        public direcional: boolean = Aresta.defaultDirecional,
    ) {

    }

    public toString()
    {
        return `${this.origem.nome} ${this.direcional ? '-' : '<'}--> ${this.destino.nome} (value: ${this.valor})`;
    }
}