import { Grafo } from "./Grafo";
import { Vertice } from "./Vertice";

interface Point {
    x: number;
    y: number;
}

export class GraphRenderer
{
    private static readonly FONT_SIZE = 14;
    private static readonly  TEXT_ADJUSTMENT = 4;

    // private ctx: CanvasRenderingContext2D | null;

    constructor(
        // private canvas: HTMLCanvasElement,
        private ctx: CanvasRenderingContext2D,
        public grafo: Grafo
    ) {
        // this.ctx = this.canvas.getContext("2d");
    }

    private static calcCircleIntersection(center: Point, radius: number, point: Point): Point
    {
        // Vetor diretor da reta
        const directionVector: Point = {
            x: point.x - center.x,
            y: point.y - center.y,
        };

        // Distância entre o centro do círculo e o ponto dado
        const distanceToCenter = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2);

        // Normaliza o vetor diretor da reta (torna-o um vetor unitário)
        const normalizedDirectionVector: Point = {
            x: directionVector.x / distanceToCenter,
            y: directionVector.y / distanceToCenter,
        };

        // Verifica se o ponto dado está dentro do círculo
        if(distanceToCenter <= radius)
            return point;

        // Calcula o ponto de interseção entre a reta e o limite do círculo
        const intersection: Point = {
            x: center.x + normalizedDirectionVector.x * radius,
            y: center.y + normalizedDirectionVector.y * radius,
        };

        return intersection;
    }

    /**
     * Calcula as coordenadas de um triângulo a partir do ponto `destino` e com direção alinhada à reta origem-destino.
     */
    private static calcTrianglePoints(
        origem: Point,
        destino: Point,
        altura: number,
        base?: number
    ): {
        pontosTriangulo: Point[],
        pontoCentroBase: Point 
    }{
        // Caso base seja undefined, o triângulo será equilátero
        if(!base)
            base = 2 * altura / (3 ** 0.5);

        // CALCULAR PONTO C (CENTRO DA BASE)

        // Calcula o vetor de deslocamento AB
        const vetorAB = [destino.x - origem.x, destino.y - origem.y];
        // Calcula o comprimento do vetor AB
        const comprimentoAB = Math.sqrt((vetorAB[0] ** 2) + (vetorAB[1] ** 2));
        // Calcula o vetor de deslocamento normalizado AB
        const vetorNormalizadoAB = [vetorAB[0] / comprimentoAB, vetorAB[1] / comprimentoAB];
        // Calcula as coordenadas do ponto C
        const pontoC = [destino.x - altura * vetorNormalizadoAB[0], destino.y - altura * vetorNormalizadoAB[1]];
        
        // CALCULAR PONTOS DO TRIÂNGULO

        // Vetor de deslocamento perpendicular
        const vetorPerpendicular = [-vetorNormalizadoAB[1], vetorNormalizadoAB[0]];
        // Multiplica o vetor perpendicular pela distância b
        const vetorDeslocamentoD = [vetorPerpendicular[0] * (base / 2), vetorPerpendicular[1] * (base / 2)];
        // Coordenadas do ponto D
        const x4 = pontoC[0] + vetorDeslocamentoD[0];
        const y4 = pontoC[1] + vetorDeslocamentoD[1];
        // Coordenadas do ponto E
        const x5 = pontoC[0] - vetorDeslocamentoD[0];
        const y5 = pontoC[1] - vetorDeslocamentoD[1];

        return {
            pontosTriangulo: [
                destino,
                { x: x4, y: y4 },
                { x: x5, y: y5 }
            ],
            pontoCentroBase: { x: pontoC[0], y: pontoC[1] }
        };
    }

    private drawCircle(x: number, y: number, raio: number) {
        this.ctx.arc(x, y, raio, 0, 2 * Math.PI);
    }
    
    public clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    public render()
    {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.font = `${GraphRenderer.FONT_SIZE}px consolas`; // sans-serif
        this.ctx.lineWidth = 1;

        for(const v of this.grafo.vertices)
        {
            for(const a of v.arestas)
            {
                // Calcula o ponto de intersecção entre o círculo (Vértice) e a reta origem-destino
                const circleIntersectionPoint = GraphRenderer.calcCircleIntersection(
                    { x: a.destino.x, y: a.destino.y },
                    Vertice.raio,
                    { x: a.origem.x, y: a.origem.y }
                );

                // Define o fim da linha da aresta, para caso ela tenha uma cabeça de seta
                let pontoFimLinha: Point = {
                    x: circleIntersectionPoint.x,
                    y: circleIntersectionPoint.y
                };

                // CABEÇA DA SETA DA ARESTA

                if(a.direcional)
                {
                    // Calcula os pontos do triângulo que forma a cabeça da seta
                    const { pontosTriangulo: pontos, pontoCentroBase } = GraphRenderer.calcTrianglePoints(
                        { x: a.origem.x, y: a.origem.y },
                        { x: circleIntersectionPoint.x, y: circleIntersectionPoint.y },
                        12, 12
                    );
                    this.ctx.beginPath();
                    this.ctx.fillStyle = a.marcada ? 'red' : 'black';
                    this.ctx.moveTo(pontos[0].x, pontos[0].y);
                    this.ctx.lineTo(pontos[1].x, pontos[1].y);
                    this.ctx.lineTo(pontos[2].x, pontos[2].y);
                    this.ctx.fill();

                    // Sobrescreve a variável para que a linha não passe por baixo da cabeça da seta
                    pontoFimLinha = { x: pontoCentroBase.x, y: pontoCentroBase.y };
                }

                // ARESTA

                this.ctx.beginPath();
                this.ctx.strokeStyle = a.marcada ? 'red' : 'black';
                this.ctx.lineWidth = a.marcada ? 3 : 1;
                this.ctx.moveTo(a.origem.x, a.origem.y);
                this.ctx.lineTo(pontoFimLinha.x, pontoFimLinha.y);
                this.ctx.stroke();

                // VALOR DA ARESTA

                const xValor = (a.origem.x + circleIntersectionPoint.x) / 2;
                const yValor = (a.origem.y + circleIntersectionPoint.y) / 2

                this.ctx.beginPath();
                this.ctx.fillStyle = 'white';
                this.drawCircle(xValor, yValor, GraphRenderer.FONT_SIZE / 2);
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.fillStyle = 'black';
                this.ctx.fillText(
                    a.valor + '',
                    xValor - GraphRenderer.TEXT_ADJUSTMENT,
                    yValor + GraphRenderer.TEXT_ADJUSTMENT
                );
                this.ctx.closePath();
            }
        }
        
        for(const v of this.grafo.vertices)
            this.drawVertex(v);
    }

    drawVertex(v: Vertice)
    {
        // Vértice
        this.ctx.beginPath();
        this.ctx.fillStyle = v.selected ? 'blue' : (v.marcado ? 'red' : 'black');
        this.drawCircle(v.x, v.y, Vertice.raio);
        this.ctx.fill();

        // Nome dos vértice
        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        //ctx.font = 
        this.ctx.fillText(
            v.nome,
            v.x - GraphRenderer.TEXT_ADJUSTMENT,
            v.y + GraphRenderer.TEXT_ADJUSTMENT
        );
        this.ctx.closePath();
    }

    rerender() {
        this.clear();
        this.render();
    }

    teste(x: number, y: number) {
        this.drawVertex(new Vertice(20, '*', x, y));
    }
}