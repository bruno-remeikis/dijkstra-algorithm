import { Aresta } from "./Aresta";
import { Vertice } from "./Vertice";

export class Grafo
{
    private _vertices: Vertice[] = Grafo.gerarGrafoPadrao();

    private _selectedVertices: Vertice[] = [];

    get vertices() {
        return this._vertices;
    }

    get selectedVertices(): Vertice[] {
        return this._selectedVertices;
    }

    get selectedEdges(): Aresta[] {
        return this._vertices.flatMap(v => v.arestas).filter(e => e.selected);
    }

    get selectedVertex(): Vertice | null {
        //return this._vertices.filter(v => v.selected);
        return this._selectedVertices.length !== 0
            ? this._selectedVertices[this._selectedVertices.length - 1]
            : null;
    }

    static gerarGrafoPadrao()
    {
        const adjMatrix = [
            [  0,  2,  0,  1,  0,  0,  0, ],
            [  0,  0,  0,  3,  9,  0,  0, ],
            [  4,  0,  0,  0,  0,  5,  0, ],
            [  0,  0,  2,  0,  2,  8,  4, ],
            [  0,  0,  0,  0,  0,  0,  6, ],
            [  0,  0,  0,  0,  0,  0,  0, ],
            [  0,  0,  0,  0,  0,  1,  0, ],
        ];
    
        const vertices: Vertice[] = [];
    
        for(let i = 0; i < adjMatrix.length; i++) {
            const v = Vertice.criarVertice();
            if(v)
                vertices.push(v);
        }

        vertices[0].setPosition(150, 50);
        vertices[1].setPosition(300, 50);
        
        vertices[2].setPosition(75, 150);
        vertices[3].setPosition(225, 150);
        vertices[4].setPosition(385, 150);
        
        vertices[5].setPosition(150, 250);
        vertices[6].setPosition(300, 250);
        
        // Conectar vértices (criar arestas)
        for(let i = 0; i < adjMatrix.length; i++)
            for(let j = 0; j < adjMatrix.length; j++)
                if(adjMatrix[i][j] > 0)
                    vertices[i].conectar(vertices[j], adjMatrix[i][j], true);
    
        return vertices;
    }

    reset() {
        this._vertices = [];
        Vertice.resetIndex();
    }

    addVertex(x: number, y: number): Vertice | null {
        const v = Vertice.criarVertice();
        if(v) {
            v.setPosition(x, y);
            this._vertices.push(v);
        }
        return v;
    }

    connectVertices(x: number, y: number)
    {
        let clicked: Vertice | null = this.getClickedVertex(x, y);

        if(!clicked)
            return;

        // Se o vértice clicado já tiver sido selecionado: desseleciona-o
        if(clicked.selected) {
            this.unselectVertex(clicked);
        }
        else {
            const selectedVertex = this.selectedVertex;

            // Se houver vértice selecionado anterormente: conecta-o com o `clicked`
            if(selectedVertex)
            {
                let valorAresta = Number(prompt("Valor da aresta:"));
                if(!valorAresta || isNaN(valorAresta) || valorAresta <= 0)
                    valorAresta = 1;

                selectedVertex.conectar(clicked, valorAresta, true);
                this.unselectAllVertices();
            }
            // Se não houver vértice selecionado ainda: seleciona o clicado
            else
                this.selectVertex(clicked);
        }
    }

    selectVertex(v: Vertice) {
        if(!v.selected) {
            v.selected = true;
            this._selectedVertices.push(v);
        }
    }

    unselectVertex(v: Vertice) {
        if(v.selected) {
            v.selected = false;
            this._selectedVertices = this._selectedVertices.filter(_v => _v !== v);
        }
    }

    selectVertices(vertices: Vertice[]) {
        vertices.forEach(v => this.selectVertex(v));
    }

    unselectVertices(vertices: Vertice[]) {
        vertices.forEach(v => this.unselectVertex(v));
    }

    // "All"

    setAllVerticesSelected(selected: boolean): void {
        this._vertices.forEach(v => v.selected = selected);
        this._selectedVertices = selected ? this._vertices : [];
    }

    setAllEdgesSelected(selected: boolean): void {
        this._vertices.forEach(v =>
            v.arestas.forEach(a => a.selected = selected)
        );
    }

    setAllElementsSelected(selected: boolean): void {
        this._vertices.forEach(v => {
            v.selected = selected;
            v.arestas.forEach(a => a.selected = selected);
        });
        this._selectedVertices = selected ? this._vertices : [];
    }

    selectAllVertices = (): void => this.setAllVerticesSelected(true);

    selectAllEdges = (): void => this.setAllEdgesSelected(true);

    selectAllElements = (): void => this.setAllElementsSelected(true);

    unselectAllVertices = (): void => this.setAllVerticesSelected(false);

    unselectAllEdges = (): void => this.setAllEdgesSelected(false);

    unselectAllElements = (): void => this.setAllElementsSelected(false);

    // End "All"

    haveSelectedVertices(): boolean {
        return this._selectedVertices.length > 0;
    }

    haveSelectedEdges(): boolean {
        for(const v of this._vertices)
            if(v.haveSelectedEdge())
                return true;
        return false;
    }

    haveSelectedElements(): boolean {
        return this.haveSelectedVertices() || this.haveSelectedEdges();
    }

    getClickedVertex(x: number, y: number): Vertice | null {
        for(const v of this._vertices.reverse())
            if(v.havePoint(x, y))
                return v;
        return null;
    }

    getClickedEdge(x: number, y: number): Aresta | null {
        for(const v of this._vertices.reverse())
            for(const a of v.arestas)
                if(a.havePoint(x, y))
                    return a;
        return null;
    }

    /**
     * Remove os vértices contidos no array, bem como as arestas que os possuem como origem ou destino
     * @param vertices Vértices a serem removidos do grafo
     */
    removeVertices(vertices: Vertice[]): void {
        console.log('A')

        this._vertices = this._vertices.filter(v => {
            if(vertices.includes(v)) {
                this.disconnectVertex(v);
                return false;
            }
            return true;
        });
    }

    removeEdges(edges: Aresta[]): void {
        this._vertices.forEach(v => {
            v.arestas.forEach(e => {
                if(edges.includes(e))
                    v.removeConnectionsWith(e.destino);
            })
            
        })
    }

    /**
     * Remove arestas que possuem o vértice `v` como origem ou destino
     * @param v Vértice a ser desconectado
     */
    disconnectVertex(v: Vertice): void {
        this._vertices.forEach(v2 => {
            v2.removeConnectionsWith(v);
        });
    }
}