export abstract class GraphElement
{
    public selected: boolean = false;
    public marked: boolean = false;

    get status(): string {
        return this.selected ? 'selected' : (this.marked ? 'marked' : 'default');
    }
}