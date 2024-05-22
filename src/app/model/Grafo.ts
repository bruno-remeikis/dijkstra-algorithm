import { Vertice } from "./Vertice";

export class Grafo
{
    private _vertices: Vertice[] = Grafo.gerarGrafoPadrao();

    get vertices() {
        return this._vertices;
    }

    static gerarGrafoPadrao()
    {
        const adjMatrix = [
            [  0,  2,  0,  1,  0,  0,  0, ],
            [  0,  0,  0,  3, 10,  0,  0, ],
            [  4,  0,  0,  0,  0,  5,  0, ],
            [  0,  0,  2,  0,  2,  8,  4, ],
            [  0,  0,  0,  0,  0,  0,  6, ],
            [  0,  0,  0,  0,  0,  0,  0, ],
            [  0,  0,  0,  0,  0,  1,  0, ],
        ];
    
        const vertices: Vertice[] = [];
    
        for(let i = 0; i < adjMatrix.length; i++)
        {
            const v = Vertice.criarVertice();
            if(v)
                vertices.push(v);
        }
        
        // Conectar vértices (criar arestas)
        for(let i = 0; i < adjMatrix.length; i++)
            for(let j = 0; j < adjMatrix.length; j++)
                if(adjMatrix[i][j] > 0)
                    vertices[i].conectar(vertices[j], adjMatrix[i][j], true);
    
        vertices[0].setPosition(150, 50);
        vertices[1].setPosition(300, 50);
        
        vertices[2].setPosition(75, 150);
        vertices[3].setPosition(225, 150);
        vertices[4].setPosition(385, 150);
        
        vertices[5].setPosition(150, 250);
        vertices[6].setPosition(300, 250);
    
        return vertices;
    }

    limpar() {
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
            clicked.selected = false;
        }
        else {
            console.log(clicked);
            console.log(clicked.selected);

            const selectedVertices = this.getSelectedVertices();
            console.log(selectedVertices);

            // Se houver vértice selecionado anterormente: conecta-o com o `clicked`
            if(selectedVertices.length > 0)
            {
                let valorAresta = Number(prompt("Valor da aresta:"));
                if(!valorAresta || isNaN(valorAresta) || valorAresta <= 0)
                    valorAresta = 1;

                selectedVertices[0].conectar(clicked, valorAresta, true);
                this.unselectAllVertices();
            }
            // Se não houver vértice selecionado ainda: seleciona o clicado
            else {
                clicked.selected = true;
            }
        }

        /*
        // Se o vértice clicado tiver sido selecionado
        if(selected.selected)
        {
            // Se já existir outro vértice selecionado
            if(connectedVertices.length === 1)
            {
                
            }
            else
                connectedVertices.push(selected);
        }
        // Se o vértice clicado tiver sido desselecionado
        else
            connectedVertices = connectedVertices.filter(v => selected !== v);

        gh.clear();
        gh.render();
        */
    }

    getSelectedVertices(): Vertice[] {
        return this._vertices.filter(v => v.selected);
    }

    unselectAllVertices() {
        this._vertices.forEach(v => v.selected = false);
    }

    getClickedVertex(x: number, y: number): Vertice | null {
        for(const v of this._vertices.reverse())
            if(v.hasPoint(x, y))
                return v;
        return null;
    }
}