import Vertice from "./app/model/Vertice";
import DijstraAlgorithm from "./app/model/DjikstraAlgorithm";
import GraphRenderer from "./app/model/GraphRenderer";

interface Djikstra {
    raiz: number;
    dist: number[];
    marca: number[];
    ant: number[];
}

function gerarGrafo(): Vertice[]
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
        const v = criarVertice();
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

function criarVertice(): Vertice | null
{
    if(Vertice.getLastIndex() >= 25)
        return null;

    const index = Vertice.consumeIndex();
    
    return new Vertice(index, String.fromCharCode(index + 65));
}

type Modo = 'mover' | 'add-vertice' | 'select-vertice' | 'connect-vertices';
let modo: Modo = 'mover';
let connectedVertices: Vertice[] = [];

function configModeBtn(nomeModo: Modo) {
    console.log(nomeModo);

    const el = document.getElementById('btn-modo-' + nomeModo);
    if(el)
        el.onclick = () =>
        {
            if(modo !== nomeModo)
            {
                modo = nomeModo;

                // Se mudou para um/outro modo de seleção:
                // remove os vértices que haviam sido selecionados
                if(modo !== 'select-vertice' && modo !== 'connect-vertices')
                    clearSelected();
            }
        }
}

function clearSelected() {
    while(connectedVertices.length > 0) {
        const v = connectedVertices.pop();
        if(v)
            v.selected = false;
    }
}

function main()
{
    // Elementos do grafo

    let vertices: Vertice[] = gerarGrafo();

    // Elementos HTML

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const inpOrigem = document.getElementById('origem') as HTMLInputElement;
    const inpDestino = document.getElementById('destino') as HTMLInputElement;

    // Parâmetros

    let raiz: number = 0;
    let destino: number = 5;

    // Djikstra

    let djikstraAlgorithm: DijstraAlgorithm | null = DijstraAlgorithm.process(vertices, raiz);
    if(djikstraAlgorithm)
        djikstraAlgorithm.calculatePath(destino);

    // Renderizador

    const gh: GraphRenderer = new GraphRenderer(vertices);
    gh.render();

    // Eventos

    configModeBtn('mover');
    configModeBtn('add-vertice');
    configModeBtn('select-vertice');
    configModeBtn('connect-vertices');

    const btnClear = document.getElementById('btn-clear');
    if(btnClear)
        btnClear.onclick = () => {
            clearSelected();
            while(vertices.length > 0)
                vertices.pop();
            Vertice.resetIndex();
            djikstraAlgorithm = null;
            inpOrigem.value = '';
            inpDestino.value = '';
            gh.clear();
        }

    canvas.onclick = (event) =>
    {
        const x = event.offsetX;
        const y = event.offsetY;

        switch(modo)
        {
            case 'add-vertice':
                const v = criarVertice();
                if(v) {
                    v.setPosition(x, y);
                    vertices.push(v);
        
                    gh.clear();
                    gh.render();
                }
                break;

            case 'connect-vertices':
                let selected: Vertice | undefined;
                for(const v of vertices)
                    if(v.hasPoint(x, y))
                        selected = v;
                if(selected) {
                    selected.selected = !selected.selected;

                    // Se o vértice clicado tiver sido selecionado
                    if(selected.selected)
                    {
                        // Se já existir outro vértice selecionado
                        if(connectedVertices.length === 1) 
                        {
                            let valorAresta = Number(prompt("Valor da aresta:"));
                            if(!valorAresta || isNaN(valorAresta) || valorAresta <= 0)
                                valorAresta = 1;

                            // Conecta os vértices selecionados
                            connectedVertices[0].conectar(selected, valorAresta, true);

                            // Remove seleção dos vértices
                            connectedVertices[0].selected = false;
                            connectedVertices.pop();
                            selected.selected = false;
                        }
                        else
                            connectedVertices.push(selected);
                    }
                    // Se o vértice clicado tiver sido desselecionado
                    else
                        connectedVertices = connectedVertices.filter(v => selected !== v);

                    gh.clear();
                    gh.render();
                }
                break;
        }
    };

    inpOrigem.onkeydown = (event) =>
    {
        event.preventDefault();

        const key = event.key.toUpperCase();

        if(key.length == 1)
        {
            Vertice.clearMarcacoes(vertices);
            gh.clear();

            inpOrigem.value = key;
            raiz = key.charCodeAt(0) - 65;

            try {
                if(raiz >= 0 && raiz < vertices.length) {
                    const alg = DijstraAlgorithm.process(vertices, raiz);
                    if(alg) {
                        djikstraAlgorithm = alg;
                        alg.calculatePath(destino);
                    }
                }
            }
            catch(err) {}

            gh.render();
        }
    };

    inpDestino.onkeydown = (event) =>
    {
        event.preventDefault();

        const key = event.key.toUpperCase();

        if(key.length == 1)
        {
            Vertice.clearMarcacoes(vertices);
            gh.clear();

            inpDestino.value = key;
            destino = key.charCodeAt(0) - 65;

            try {
                if(destino >= 0 && destino < vertices.length)
                    if(djikstraAlgorithm) {
                        djikstraAlgorithm.calculatePath(destino);
                    }
            }
            catch(err) {}

            gh.render();
        }
    };
}

main();