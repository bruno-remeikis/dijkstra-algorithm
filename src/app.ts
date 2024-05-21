import { Vertice } from "./app/model/Vertice";
import { DijstraAlgorithm } from "./app/model/DjikstraAlgorithm";
import { GraphRenderer } from "./app/model/GraphRenderer";
import { Grafo } from "./app/model/Grafo";

type Modo = 'mover' | 'add-vertice' | 'select-vertice' | 'connect-vertices';

let modo: Modo | undefined;
selectModo('mover');

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

// Grafo
const grafo: Grafo = new Grafo();

main();

function main()
{
    // Elementos HTML

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const inpOrigem = document.getElementById('origem') as HTMLInputElement;
    const inpDestino = document.getElementById('destino') as HTMLInputElement;

    // Parâmetros

    let raiz: number = 0;
    let destino: number = 5;

    // Djikstra

    let djikstraAlgorithm: DijstraAlgorithm | null = DijstraAlgorithm.process(grafo, raiz);
    if(djikstraAlgorithm)
        djikstraAlgorithm.calculatePath(destino);

    // Renderizador

    const gh: GraphRenderer = new GraphRenderer(/*vertices*/ grafo);
    gh.render();

    // Eventos

    configBotoesModo();

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

    /*canvas.onclick = (event) =>
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
    };*/

    //! Analizar trexos semelhantes a `grafo.vertices`
    inpOrigem.onkeydown = (event) =>
    {
        event.preventDefault();

        const key = event.key.toUpperCase();

        if(key.length == 1)
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

        if(key.length == 1)
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



function actMover() {

}

function limparTudo() {
    grafo.limpar();

    /*clearSelected();
    while(vertices.length > 0)
        vertices.pop();
    Vertice.resetIndex();
    djikstraAlgorithm = null;
    inpOrigem.value = '';
    inpDestino.value = '';
    gh.clear();*/
}



//! COLOCAR OS MÉTODOS ABAIXO SOB RESPONSABILIDADE DE UMA CLASSE ESPECIFICA

function configBotoesModo()
{
    const ctrl = document.getElementById('control-buttons');

    if(!ctrl) {
        alert('Ops. Houve um problema ao tentarmos configurar alguns botões.');
        return;
    }

    for(const child of ctrl.children) {
        const attrModo = child.getAttribute('data-modo');

        if(attrModo)
            child.addEventListener('click', () => {
                modo = attrModo as Modo;
                unselectAllModos();
                child.classList.add('selected');
            });
    }
}

function selectModo(_modo: Modo/*btn: Element*/) {
    const ctrl = document.getElementById('control-buttons');

    if(!ctrl) {
        alert('Ops. Houve um problema ao tentarmos selecionar um modo.');
        return;
    }

    modo = _modo;

    if(modo === undefined)
        return;

    for(const child of ctrl.children) {
        const attrModo = child.getAttribute('data-modo');

        if(attrModo && attrModo === _modo) {
            unselectAllModos();
            child.classList.add('selected');
            break;
        }
    }
}

function unselectAllModos() {
    const ctrl = document.getElementById('control-buttons');

    if(!ctrl) {
        alert('Ops. Houve um problema ao tentarmos desselecionar um modo.');
        return;
    }

    for(const child of ctrl.children)
        child.classList.remove('selected');
}