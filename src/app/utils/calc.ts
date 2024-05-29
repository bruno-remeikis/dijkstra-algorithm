import { Point } from "../types/Point";

export function calcCircleIntersection(center: Point, radius: number, point: Point): Point
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
export function calcTrianglePoints(
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