import { Edge } from "../graph/Edge";
import { Graph } from "../graph/Graph";
import { Vertex } from "../graph/Vertex";

interface Djikstra {
    raiz: number;
    dist: number[];
    marca: number[];
    ant: number[];
}

export class DijkstraAlgorithm
{
    private static readonly NENHUM_CAMINHO = 0;
    private static readonly ALGUM_CAMINHO = 1;
    private static readonly MELHOR_CAMINHO = 2;

    private djikstra: Djikstra | null = null;

    private _currentRoot: number | null = null;
    private _currentTarget: number | null = null;

    constructor(
        private graph: Graph,
    ) {}

    /**
     * Processa o algoritmo a partir da raiz especificada.
     * @param raiz (number) index do Vertex raiz do algoritmo.
     * @returns (DjikstraAltorithm) Retorna este próprio objeto.
     */
    public process(raiz: number): DijkstraAlgorithm
    {
        if(raiz < 0 || raiz >= this.graph.vertices.length)
            throw new Error("Houve um erro ao tentar processar o algoritmo de Dijkstra");

        this._currentRoot = raiz;

        // INICIALIZAR VETORES

        const dist: number[] = new Array(this.graph.vertices.length);
        const marca: number[] = new Array(this.graph.vertices.length);
        const ant: number[] = new Array(this.graph.vertices.length);

        for(let i = 0; i < this.graph.vertices.length; i++)
        {
            dist[i] = Number.MAX_SAFE_INTEGER; // infinito
            marca[i] = 0;
            ant[i] = -1;  // -
        }

        dist[raiz] = 0;
        marca[raiz] = DijkstraAlgorithm.ALGUM_CAMINHO;

        // RODAR ALGORITMO

        while(true)
        {
            let atual = -1;
            
            // Seleciona o vértice principal atual
            // (Vértice com marca 1 (ALGUM_CAMINHO) e menor distância acumulada)
            let menor = Number.MAX_SAFE_INTEGER;
            for(let i = 0; i < this.graph.vertices.length; i++)
                if(marca[i] == DijkstraAlgorithm.ALGUM_CAMINHO && dist[i] < menor) {
                    menor = dist[i];
                    atual = i;
                }
            
            if(atual == -1)
                break;
            
            // Atualiza a marca do vértice principal atual
            marca[atual] = DijkstraAlgorithm.MELHOR_CAMINHO;
            const v: Vertex = this.graph.vertices[atual];
            
            // Visita vértices adjacentes
            for(let a of v.edges)
            {
                let index: number;
                
                // Para edges direcionais
                if(a.directional) 
                    index = a.target.index; // Index do vértice adjacente
                // Para edges não-direcionais
                else
                    index = (a.target == v ? a.origin : a.target).index;
                
                // Caso o vértice já tenha sido o principal em algum momento, ignora-o
                if(marca[index] == DijkstraAlgorithm.MELHOR_CAMINHO)
                    continue;
                
                // Calcula distância acumulada
                let distancia: number = dist[atual] + a.value;
                
                if(marca[index] == DijkstraAlgorithm.NENHUM_CAMINHO || distancia < dist[index])
                {
                    dist[index] = distancia; 
                    marca[index] = DijkstraAlgorithm.ALGUM_CAMINHO;
                    ant[index] = v.index; // Garda de onde veio (veio do vértice principal atual)
                }
            }
        }

        this.djikstra = { raiz, dist, marca, ant };

        return this;
    }

    /**
     * Encontrar a melhor rota até um vértice, partindo da raiz especificada no processamento.
     * Ao encontrar a melhor rota, atualiza o campo Edge.marcada para true
     * @param target (number) index da edge de target
     * @returns (boolean) false caso target especificado seja inválido
     */
    public calculatePath(target: number): boolean
    {
        if(!this.djikstra)
            throw new Error('É necessário processar o algoritmo antes de calcular um caminho.');

        if(target < 0 || target >= this.graph.vertices.length)
            return false;

        this.graph.unmarkAllElements();

        this._currentTarget = target;

        const { raiz, ant } = this.djikstra;

        let atual = target;
        let possuiCaminho = false;
        do {
            const anterior = ant[atual];
    
            let edge: Edge | undefined;
            for(const a of this.graph.vertices[anterior].edges)
                if(a.target == this.graph.vertices[atual]
                && (!edge || a.value < edge.value))
                    edge = a;
    
            if(edge) {
                edge.marked = true;
                this.graph.vertices[atual].marked = true;
                possuiCaminho = true;
            }
    
            atual = anterior;
        }
        while(atual != raiz);

        if(possuiCaminho)
            this.graph.vertices[atual].marked = true;
                
        return true;
    }

    public reprocess(): DijkstraAlgorithm {
        if(this._currentRoot !== null)
            return this.process(this._currentRoot);
        throw new Error('É necessário processar o algoritmo antes de reprocessá-lo');
    }

    public recalculatePath(): boolean {
        if(this._currentTarget !== null)
            return this.calculatePath(this._currentTarget);
        return false;
    }

    /**
     * @returns (string) string contendo a tabela do algoritmo
     */
    public toString(): string
    {
        if(!this.djikstra)
            return 'Altoritmo ainda não processado';

        let tabela = '';

        const { dist, marca, ant } = this.djikstra;

        for(let i = 0; i < this.graph.vertices.length; i++)
            tabela +=
                "| " +
                this.graph.vertices[i].name + " | " +
                (dist[i] < Number.MAX_SAFE_INTEGER ? dist[i] : "\u221E") + " | " +
                marca[i] + " | " +
                (ant[i] >= 0 ? this.graph.vertices[ant[i]].name : "-") + " |";

        return tabela;
    }
}