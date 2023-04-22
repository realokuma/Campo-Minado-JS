class Celula {
    constructor (x, y, w) {
        // define as coordenadas e a largura da célula
        this.x = x;
        this.y = y;
        this.w = w;

        // inicializa as propriedades flag e covered
        // flag é nula no início, e covered é definida como true
        this.flag    = null;
        this.covered = true;

        // inicializa as propriedades neighborsList e neighborsCount
        // neighborsList é um array vazio que guardará as células vizinhas
        // neighborsCount é inicializada como zero e irá armazenar a quantidade de bombas ao redor da célula
        this.neighborsList  = [];
        this.neighborsCount = 0;
    }

    // verifica se as coordenadas do mouse estão dentro da área da célula
    selectionArea (x, y) {
        var _el = this;

        return (
            y >= _el.y * _el.w && y <= _el.y * _el.w + _el.w && x >= _el.x * _el.w && x <= _el.x * _el.w + _el.w
        );
    }

    // desenha a célula no canvas
    draw (Sprites, tileSize) {
        let _el         = this,
            coordinates = [_el.x * tileSize, _el.y * tileSize, tileSize, tileSize];

        if (_el.covered) {
            // se a célula estiver coberta, desenha uma bandeira (se houver) ou a própria célula coberta
            let flag = _el.flag	? Sprites[_el.flag]	: Sprites.covered;

            return flag.toDraw(...coordinates);
        }

        switch (_el.neighborsCount) {
            // se a célula tem bombas vizinhas, desenha um número correspondente ao número de bombas
            case -1:
                if (_el.detonated) {
                    // se a célula explodiu, desenha a explosão
                    return Sprites.detonated.toDraw(...coordinates);
                }

                Sprites.hasBomb.toDraw(...coordinates);
                break;
            case 0:
                // se a célula não tem bombas vizinhas, desenha a célula vazia ou uma bandeira (se houver)
                if (_el.flag === 'bombFlag') {
                    return Sprites.noBomb.toDraw(...coordinates);
                }

                Sprites.emptyCell.toDraw(...coordinates);
                break;
            default:
                // se a célula tem de 1 a 8 bombas vizinhas, desenha o número correspondente ou uma bandeira (se houver)
                if (_el.flag === 'bombFlag') {
                    return Sprites.noBomb.toDraw(...coordinates);
                }

                Sprites.numbers['number' + _el.neighborsCount].toDraw(...coordinates);
                break;
        }
    }

    // revela a célula e chama o método floodFill para revelar células vizinhas, caso necessário
    revealIt (matriz) {
        this.covered = false;

        if (this.neighborsCount === 0) {
            this.floodFill(matriz);
        }
    }

    // encontra células vizinhas e chama o método revealIt para cada uma
    floodFill (matriz) {
        var _el = this;

        for (var i = -1; i <= 1; i++) {
            if (!matriz[_el.y + i]) continue;
            for (var j = -1; j <= 1; j++) {
                var celula = matriz[_el.y + i][_el.x + j];
                if (!celula || !i && !j) continue;
                if (celula.neighborsCount >= 0 && celula.covered) {
                    celula.revealIt(matriz);
                }
            }
        }
    }
}

