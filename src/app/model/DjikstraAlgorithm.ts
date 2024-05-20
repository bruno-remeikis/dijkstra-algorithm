import Aresta from "./Aresta";
import Vertice from "./Vertice";

interface Djikstra {
    raiz: number;
    dist: number[];
    marca: number[];
    ant: number[];
}

export default class DijstraAlgorithm
{
    private static NENHUM_CAMINHO = 0;
    private static ALGUM_CAMINHO = 1;
    private static MELHOR_CAMINHO = 2;

    private constructor(
        private vertices: Vertice[],
        private djikstra: Djikstra
    ) {}

    /**
     * Processa o algoritmo a partir da raiz especificada
     * @param vertices (Vertice[]) vértices do grafo
     * @param raiz (number) index do Vertice raiz do algoritmo
     * @returns (DjikstraAltorithm) objeto capaz de encontrar a melhor rota até um vértice, partindo da raiz especificada
     */
    public static process(vertices: Vertice[], raiz: number): DijstraAlgorithm | null
    {
        if(raiz < 0 || raiz >= vertices.length)
            return null;

        // INICIALIZAR VETORES

        const dist: number[] = new Array(vertices.length);
        const marca: number[] = new Array(vertices.length);
        const ant: number[] = new Array(vertices.length);

        for(let i = 0; i < vertices.length; i++)
        {
            dist[i] = Number.MAX_SAFE_INTEGER; // infinito
            marca[i] = 0;
            ant[i] = -1;  // -
        }

        dist[raiz] = 0;
        marca[raiz] = DijstraAlgorithm.ALGUM_CAMINHO;

        // RODAR ALGORITMO

        while(true)
        {
            let atual = -1;
            
            // Seleciona o vértice principal atual
            // (Vértice com marca 1 (ALGUM_CAMINHO) e menor distância acumulada)
            let menor = Number.MAX_SAFE_INTEGER;
            for(let i = 0; i < vertices.length; i++)
                if(marca[i] == DijstraAlgorithm.ALGUM_CAMINHO && dist[i] < menor) {
                    menor = dist[i];
                    atual = i;
                }
            
            if(atual == -1)
                break;
            
            // Atualiza a marca do vértice principal atual
            marca[atual] = DijstraAlgorithm.MELHOR_CAMINHO;
            const v: Vertice = vertices[atual];
            
            // Visita vértices adjacentes
            for(let a of v.arestas)
            {
                let index: number;
                
                // Para arestas direcionais
                if(a.direcional) 
                    index = a.destino.index; // Index do vértice adjacente
                // Para arestas não-direcionais
                else
                    index = (a.destino == v ? a.origem : a.destino).index;
                
                // Caso o vértice já tenha sido o principal em algum momento, ignora-o
                if(marca[index] == DijstraAlgorithm.MELHOR_CAMINHO)
                    continue;
                
                // Calcula distância acumulada
                let distancia: number = dist[atual] + a.valor;
                
                if(marca[index] == DijstraAlgorithm.NENHUM_CAMINHO || distancia < dist[index])
                {
                    dist[index] = distancia; 
                    marca[index] = DijstraAlgorithm.ALGUM_CAMINHO;
                    ant[index] = v.index; // Garda de onde veio (veio do vértice principal atual)
                }
            }
        }

        const djikstra: Djikstra = { raiz, dist, marca, ant };
        return new DijstraAlgorithm(vertices, djikstra);
    }

    /**
     * Encontrar a melhor rota até um vértice, partindo da raiz especificada no processamento.
     * Ao encontrar a melhor rota, atualiza o campo Aresta.marcada para true
     * @param destino (number) index da aresta de destino
     * @returns (boolean) false caso destino especificado seja inválido
     */
    public calculatePath(destino: number): boolean
    {
        if(destino < 0 || destino >= this.vertices.length)
            return false;

        const { raiz, ant } = this.djikstra;

        let atual = destino;
        let possuiCaminho = false;
        do {
            const anterior = ant[atual];
    
            let aresta: Aresta | undefined;
            for(const a of this.vertices[anterior].arestas)
                if(a.destino == this.vertices[atual]
                && (!aresta || a.valor < aresta.valor))
                    aresta = a;
    
            if(aresta) {
                aresta.marcada = true;
                this.vertices[atual].marcado = true;
                possuiCaminho = true;
            }
    
            atual = anterior;
        }
        while(atual != raiz);

        if(possuiCaminho)
            this.vertices[atual].marcado = true;
                
        return true;
    }

    /**
     * @returns (string) string contendo a tabela do algoritmo
     */
    public toString(): string
    {
        let tabela = '';

        const { dist, marca, ant } = this.djikstra;

        for(let i = 0; i < this.vertices.length; i++)
            tabela +=
                "| " +
                this.vertices[i].nome + " | " +
                (dist[i] < Number.MAX_SAFE_INTEGER ? dist[i] : "\u221E") + " | " +
                marca[i] + " | " +
                (ant[i] >= 0 ? this.vertices[ant[i]].nome : "-") + " |";

        return tabela;
    }
}