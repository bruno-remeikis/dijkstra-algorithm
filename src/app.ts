import { Vertice } from "./app/model/Vertice";
import { DijkstraAlgorithm } from "./app/model/DjikstraAlgorithm";
import { GraphRenderer } from "./app/model/GraphRenderer";
import { Grafo } from "./app/model/Grafo";
import { ModeManager } from "./app/model/ModeManager";

// Elementos HTML
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const inpOrigem = document.getElementById('origem') as HTMLInputElement;
const inpDestino = document.getElementById('destino') as HTMLInputElement;
// Main buttons
const mainBtns = document.getElementById('main-buttons');
const btnClean = document.getElementById('btn-clean');
// Control buttons
const controlBtns = document.getElementById('control-buttons');
const btnSelectAll = document.getElementById('btn-select-all');
const btnUnunselectAll = document.getElementById('btn-select-all');
const btnDelete = document.getElementById('btn-delete');

// Grafo
const grafo: Grafo = new Grafo();

// Renderizador
const ctx = canvas.getContext("2d")!;
const gh: GraphRenderer = new GraphRenderer(ctx, grafo);

main();

function main()
{
    // Parâmetros

    let raiz: number = 0;
    let destino: number = 5;

    // Djikstra

    let djikstraAlgorithm: DijkstraAlgorithm = DijkstraAlgorithm.process(grafo, raiz);
    djikstraAlgorithm.calculatePath(destino);

    // Eventos

    if(!mainBtns) {
        alert('Ops. Houve um problema ao tentarmos configurar os modos de manipulação do grafo.')
        return;
    }

    const modeManager: ModeManager = new ModeManager(mainBtns);
    modeManager.configModeBtns(grafo, gh, () => {
        controlBtns?.classList.remove('visible');
    }, {
        'select-vertex': () => controlBtns?.classList.add('visible')
    });
    modeManager.selectMode('move');

    btnClean?.addEventListener('click', () => limparTudo(gh));

    btnSelectAll?.addEventListener('click', () => selectAll());

    btnUnunselectAll?.addEventListener('click', () => unselectAll());
    
    btnDelete?.addEventListener('click', () => deletarSelecionados(gh));

    // Iniciar

    gh.render();

    /*
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
    */

    canvas.onclick = (event) =>
    {
        const x = event.offsetX;
        const y = event.offsetY;

        gh.rerender();

        switch(modeManager.mode)
        {
            case 'move': {
                let v = grafo.selectedVertex;
                if(v) {
                    grafo.unselectVertex(v);
                    gh.rerender();
                }
                else {
                    v = grafo.getClickedVertex(x, y);
                    if(v) {
                        grafo.selectVertex(v);
                        gh.rerender();
                    }
                }
                break;
            }
            case 'select-vertex': {
                const v = grafo.getClickedVertex(x, y);
                if(v) {
                    if(v.selected)
                        grafo.unselectVertex(v);
                    else
                        grafo.selectVertex(v);

                    if(grafo.haveSelectedVertices())
                        controlBtns?.classList.add('enabled');
                    else
                        controlBtns?.classList.remove('enabled');
                }
                gh.rerender();
                break;
            }
            case 'add-vertex': {
                const v = grafo.addVertex(x, y);
                if(v)
                    gh.rerender();
                break;
            }
            case 'connect-vertices': {
                grafo.connectVertices(x, y);
                gh.rerender();
                break;
            }
        }
    };

    canvas.onmousemove = (event) =>
    {
        const x = event.offsetX;
        const y = event.offsetY;

        switch(modeManager.mode)
        {
            case 'move':
                const v = grafo.selectedVertex;
                if(v) {
                    v.x = x;
                    v.y = y;
                    gh.rerender();
                }
                break;

            /*case 'add-vertex':
                gh.rerender();
                gh.teste(x, y);
                break;*/
        }
    }

    //! Analizar trexos semelhantes a `grafo.vertices`
    inpOrigem.onkeydown = (event) =>
    {
        event.preventDefault();

        const key = event.key.toUpperCase();

        if(key.length === 1)
        {
            Vertice.clearMarcacoes(grafo.vertices);
            gh.clear();

            inpOrigem.value = key;
            raiz = key.charCodeAt(0) - 65;

            try {
                if(raiz >= 0 && raiz < grafo.vertices.length) {
                    const alg = DijkstraAlgorithm.process(grafo, raiz);
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

    //! Analizar trexos semelhantes a `grafo.vertices`
    inpDestino.onkeydown = (event) =>
    {
        event.preventDefault();

        const key = event.key.toUpperCase();

        if(key.length === 1)
        {
            Vertice.clearMarcacoes(grafo.vertices);
            gh.clear();

            inpDestino.value = key;
            destino = key.charCodeAt(0) - 65;

            try {
                if(destino >= 0 && destino < grafo.vertices.length)
                    if(djikstraAlgorithm) {
                        djikstraAlgorithm.calculatePath(destino);
                    }
            }
            catch(err) {}

            gh.render();
        }
    };
}

function configCanvasClickEvent() {

}

function limparTudo(gh: GraphRenderer) {
    if(window.confirm("Deseja mesmo apagar tudo?"))
    {
        grafo.reset();
        gh.rerender();
    }

    /*clearSelected();
    while(vertices.length > 0)
        vertices.pop();
    Vertice.resetIndex();
    djikstraAlgorithm = null;
    inpOrigem.value = '';
    inpDestino.value = '';
    gh.clear();*/
}

function selectAll() {
    grafo.selectAllVertices();
    gh.rerender();
}

function unselectAll() {
    grafo.unselectAllVertices();
    gh.rerender();
}

function deletarSelecionados(gh: GraphRenderer) {
    const vertices = grafo.selectedVertices;
    if(!vertices)
        return;
    grafo.removeVertices(vertices);
    gh.rerender();
}
