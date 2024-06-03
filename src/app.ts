import { Vertex } from "./app/classes/graph/Vertex";
import { DijkstraAlgorithm } from "./app/classes/algorithms/DjikstraAlgorithm";
import { GraphRenderer } from "./app/classes/graphics/GraphRenderer";
import { Graph } from "./app/classes/graph/Graph";
import { ModeManager } from "./app/classes/managers/ModeManager";

// Elementos HTML
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const inpOrigem = document.getElementById('origem') as HTMLInputElement;
const inpDestino = document.getElementById('destino') as HTMLInputElement;
// Main buttons
const mainBtns = document.getElementById('main-buttons') as HTMLDivElement;
const btnClean = document.getElementById('btn-clean') as HTMLButtonElement;
// Control buttons
const controlBtns = document.getElementById('control-buttons') as HTMLDivElement;
const btnSelectAll = document.getElementById('btn-select-all') as HTMLButtonElement;
const btnUnselectAll = document.getElementById('btn-unselect-all') as HTMLButtonElement;
const btnDelete = document.getElementById('btn-delete') as HTMLButtonElement;

// Graph
const graph: Graph = new Graph();

// Managers
const modeManager: ModeManager = new ModeManager(mainBtns);

// Algorithm
let raiz: number = 0;
let destino: number = 5;
let djikstraAlgorithm: DijkstraAlgorithm = new DijkstraAlgorithm(graph);

// Renderizador
const ctx = canvas.getContext("2d")!;
const gh: GraphRenderer = new GraphRenderer(ctx, graph);

main();

function main()
{
    // Eventos

    modeManager.configModeBtns(graph, gh, () => {
        controlBtns.classList.remove('visible');
    }, {
        'select-vertex': () => controlBtns.classList.add('visible')
    });
    modeManager.selectMode('move');

    configCanvasClickEvent();

    // Iniciar

    djikstraAlgorithm.process(raiz)
        .calculatePath(destino);

    gh.render();
}

function configCanvasClickEvent()
{
    btnClean.onclick = () => limparTudo(gh);
    btnSelectAll.onclick = selectAll;
    btnUnselectAll.onclick = unselectAll;
    btnDelete.onclick = () => {
        if(window.confirm("Deseja mesmo apagar todos estes elementos?"))
            deleteSelected(gh);
    };

    canvas.onclick = (event) =>
    {
        const x = event.offsetX;
        const y = event.offsetY;

        gh.rerender();

        switch(modeManager.mode)
        {
            case 'move': {
                let v = graph.selectedVertex;
                if(v) {
                    graph.unselectVertex(v);
                    gh.rerender();
                }
                else {
                    v = graph.getClickedVertex(x, y);
                    if(v) {
                        graph.selectVertex(v);
                        gh.rerender();
                    }
                }
                break;
            }
            case 'select-vertex': {
                const v = graph.getClickedVertex(x, y);
                if(v) {
                    if(v.selected)
                        graph.unselectVertex(v);
                    else
                        graph.selectVertex(v);

                    switchControlButtonsVisibility();
                }
                else {
                    const a = graph.getClickedEdge(x, y);
                    if(a) {
                        a.selected = !a.selected;
                        switchControlButtonsVisibility();
                    }
                }
                gh.rerender();
                break;
            }
            case 'add-vertex': {
                const v = graph.addVertex(x, y);
                if(v)
                    gh.rerender();
                break;
            }
            case 'connect-vertices': {
                graph.connectVertices(x, y);
                
                try {
                    djikstraAlgorithm.reprocess()
                        .recalculatePath();
                } catch(err) {}

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
                const v = graph.selectedVertex;
                if(v) {
                    v.move(x, y);
                    gh.rerender();
                }
                break;

            /*case 'add-vertex':
                gh.rerender();
                gh.teste(x, y);
                break;*/
        }
    }

    //! Analizar trexos semelhantes a `graph.vertices`
    inpOrigem.onkeydown = (event) =>
    {
        event.preventDefault();

        const key = event.key.toUpperCase();

        if(key.length === 1)
        {
            Vertex.markOff(graph.vertices);
            gh.clear();

            inpOrigem.value = key;
            raiz = key.charCodeAt(0) - 65;

            try {
                djikstraAlgorithm.process(raiz)
                    .recalculatePath();
            } catch(err) {}

            gh.render();
        }
    };

    //! Analizar trexos semelhantes a `graph.vertices`
    inpDestino.onkeydown = (event) =>
    {
        event.preventDefault();

        const key = event.key.toUpperCase();

        if(key.length === 1)
        {
            Vertex.markOff(graph.vertices);
            gh.clear();

            inpDestino.value = key;
            destino = key.charCodeAt(0) - 65;

            try {
                if(destino >= 0 && destino < graph.vertices.length)
                    if(djikstraAlgorithm) {
                        djikstraAlgorithm.calculatePath(destino);
                    }
            }
            catch(err) {}

            gh.render();
        }
    };
}

function switchControlButtonsVisibility() {
    if(graph.hasSelectedElements())
        controlBtns?.classList.add('enabled');
    else
        controlBtns?.classList.remove('enabled');
}

function limparTudo(gh: GraphRenderer) {
    if(window.confirm("Deseja mesmo apagar tudo?")) {
        graph.reset();
        inpOrigem.value = '';
        inpDestino.value = '';
        gh.clear();
    }
}

function selectAll() {
    graph.selectAllElements();
    gh.rerender();

    switchControlButtonsVisibility();
}

function unselectAll() {
    graph.unselectAllElements();
    gh.rerender();

    switchControlButtonsVisibility();
}

function deleteSelected(gh: GraphRenderer)
{
    const vertices = graph.selectedVertices;
    if(vertices)
        graph.removeVertices(vertices);

    const edges = graph.selectedEdges;
    console.log(edges);
    if(edges)
        graph.removeEdges(edges);

    graph.unselectAllElements();

    djikstraAlgorithm.reprocess()
        .recalculatePath(); 

    gh.rerender();
}
