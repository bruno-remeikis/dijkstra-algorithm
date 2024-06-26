import { Graph } from "../graph/Graph";
import { GraphRenderer } from "../graphics/GraphRenderer";

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
        private container: HTMLElement
    ) {}

    configModeBtns(graph: Graph, gh: GraphRenderer, fn?: Function, fns?: {[name: string]: Function})
    {
        for(const child of this.container.children) {
            const attrMode = child.getAttribute(dataMode);

            if(attrMode)
                child.addEventListener('click', () => {
                    this._mode = attrMode as Mode;
                    this.unselectAllModes();
                    graph.unselectAllVertices();
                    child.classList.add(selectedClass);

                    if(fn)
                        fn();

                    if(fns && fns[attrMode])
                        fns[attrMode]();

                    gh.rerender();
                });
        }
    }

    selectMode(newMode: Mode)
    {
        this._mode = newMode;

        if(this._mode === undefined)
            return;

        for(const child of this.container.children) {
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
        for(const child of this.container.children)
            child.classList.remove(selectedClass);
    }
}