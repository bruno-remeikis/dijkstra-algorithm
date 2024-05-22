import { Vertice } from "./app/model/Vertice";
import { DijstraAlgorithm } from "./app/model/DjikstraAlgorithm";
import { GraphRenderer } from "./app/model/GraphRenderer";
import { Grafo } from "./app/model/Grafo";
import { ModeManager } from "./app/model/ModeManager";

// type Modo = 'mover' | 'add-vertice' | 'select-vertice' | 'connect-vertices';

// let modo: Modo | undefined;
// selectModo('mover');

let connectedVertices: Vertice[] = [];

/*function configModeBtn(nomeModo: Modo) {
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
}*/

function clearSelected() {
    while(connectedVertices.length > 0) {
        const v = connectedVertices.pop();
        if(v)
            v.selected = false;
    }
}

// Elementos HTML
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const inpOrigem = document.getElementById('origem') as HTMLInputElement;
const inpDestino = document.getElementById('destino') as HTMLInputElement;
const ctrl = document.getElementById('control-buttons');
// Grafo
const grafo: Grafo = new Grafo();
// Renderizador
const gh: GraphRenderer = new GraphRenderer(canvas, grafo);


main();

function main()
{
    // Parâmetros

    let raiz: number = 0;
    let destino: number = 5;

    // Djikstra

    let djikstraAlgorithm: DijstraAlgorithm | null = DijstraAlgorithm.process(grafo, raiz);
    if(djikstraAlgorithm)
        djikstraAlgorithm.calculatePath(destino);

    // Eventos

    if(!ctrl) {
        alert('Ops. Houve um problema ao tentarmos configurar os modos de manipulação do grafo.')
        return;
    }

    const modeManager: ModeManager = new ModeManager(ctrl);
    modeManager.configModeBtns();
    modeManager.selectMode('move');

    document.getElementById('btn-clean')?.addEventListener('click', () => limparTudo(gh));

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

        switch(modeManager.mode)
        {
            case 'add-vertex':
                const v = grafo.addVertex(x, y);
                if(v)
                    gh.rerender();
                break;

            case 'connect-vertices':
                grafo.connectVertices(x, y);
                gh.rerender();
                break;
        }
    };

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
                    const alg = DijstraAlgorithm.process(grafo, raiz);
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
        grafo.limpar();
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