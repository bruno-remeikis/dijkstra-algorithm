export abstract class GraphElement
{
    public selected: boolean = false;
    public marcado: boolean = false;

    get status(): string {
        return this.selected ? 'selected' : (this.marcado ? 'marked' : 'default');
    }
}