import { Grafo } from "./Grafo";
import { GraphRenderer } from "./GraphRenderer";

export type Mode = 'move' | 'add-vertex' | 'select-vertex' | 'connect-vertices';

const dataModeName = 'mode';
const dataMode = `data-${dataModeName}`;
const selectedClass = 'selected';

export class ModeManager
{
    private _mode: Mode | undefined;

    get mode() {
        return this._mode;
    }

    constructor(
        private ctrl: HTMLElement
    ) {}

    configModeBtns(grafo: Grafo, gh: GraphRenderer)
    {
        for(const child of this.ctrl.children) {
            const attrMode = child.getAttribute(dataMode);

            if(attrMode)
                child.addEventListener('click', () => {
                    this._mode = attrMode as Mode;
                    this.unselectAllModes();
                    grafo.unselectAllVertices();
                    child.classList.add(selectedClass);

                    gh.rerender();
                });
        }
    }

    selectMode(newMode: Mode)
    {
        this._mode = newMode;

        if(this._mode === undefined)
            return;

        for(const child of this.ctrl.children) {
            const attrModo = child.getAttribute(dataMode);

            if(attrModo && attrModo === newMode) {
                this.unselectAllModes();
                child.classList.add(selectedClass);
                break;
            }
        }
    }

    unselectAllModes()
    {
        for(const child of this.ctrl.children)
            child.classList.remove(selectedClass);
    }
}