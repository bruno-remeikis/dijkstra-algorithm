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
}