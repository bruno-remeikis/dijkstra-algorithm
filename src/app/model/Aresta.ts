import { StyleMap } from "../types/StyleProps";
import { Vertice } from "./Vertice";

export class Aresta
{
    public static readonly STYLE: StyleMap = {
        default:  { color: /*'#212d38'*/ '#444444', borderColor: '' },
        selected: { color: '#005EFF', borderColor: '' },
        marked:   { color: '#1A9E1A', borderColor: '' }
    };

    static readonly defaultDirecional = false;
    public static readonly raioValor = 7;

    public xValor: number;
    public yValor: number;

    public marcada: boolean = false;

    constructor(
        public origem: Vertice,
        public destino: Vertice,
        public valor: number = 1,
        public direcional: boolean = Aresta.defaultDirecional,
    ) {
        this.xValor = 0;
        this.yValor = 0;
    }

    public toString(): string
    {
        return `${this.origem.nome} ${this.direcional ? '-' : '<'}--> ${this.destino.nome} (value: ${this.valor})`;
    }
}