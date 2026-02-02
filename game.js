var screen;
var ctx;
var head;
var spider;
var body;
var carnage;

var points;
var pontuacao = 0;

var spider_x;
var spider_y;

var carnage_x = [];
var carnage_y = [];

var soundeffect1 = new Audio();
soundeffect1.src = "./sound-effects/bite.mp3";

var soundeffect2 = new Audio();
soundeffect2.src = "./sound-effects/theme-song.mp3";

var soundeffect3 = new Audio();
soundeffect3.src = "./sound-effects/game-over.mp3";

var soundeffect4 = new Audio();
soundeffect4.src = "./sound-effects/defeated.mp3";

var paraEsquerda = false;
var paraDireita = true;
var paraCima = false;
var paraBaixo = false;
var noJogo = true;

const TAMANHO_PONTO = 10;
const ALEATORIO_MAXIMO = 29;
var ATRASO = 140;
var ACELERAR = 3;
const C_ALTURA = 300;
const C_LARGURA = 300;

const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;
const TECLA_ABAIXO = 40;

var x = [];
var y = [];

onkeydown = verificarTecla;

// Inicia o jogo automaticamente quando a página carregar
window.onload = function() {
    iniciar();
};

// Botão de reiniciar
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("restart-button").addEventListener("click", function() {
        location.reload();
    });
});

function iniciar() {
    screen = document.getElementById("screen");
    ctx = screen.getContext("2d");

    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);
    carregarImagens();
    criarCobra();
    localizarObst();
    localizarSpider();
    setTimeout("cicloDeJogo()", ATRASO);
    soundeffect2.play();
}

function carregarImagens() {
    head = new Image();
    head.src = "./sprites/venom_head.png";

    body = new Image();
    body.src = "./sprites/venom_body.png";

    spider = new Image();
    spider.src = "./sprites/spiderman.png";

    carnage = new Image();
    carnage.src = "./sprites/carnage.png";
}

function criarCobra() {
    points = 3;

    for (var z = 0; z < points; z++) {
        x[z] = 50 - z * TAMANHO_PONTO;
        y[z] = 50;
    }
}

function localizarSpider() {
    var r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    spider_x = r * TAMANHO_PONTO;

    r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    spider_y = r * TAMANHO_PONTO;
}

function localizarObst() {
    var R = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    carnage_x.push(R * TAMANHO_PONTO);

    R = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    carnage_y.push(R * TAMANHO_PONTO);
}

function cicloDeJogo() {
    if (noJogo) {
        verificarObst();
        verificarSpider();
        verificarColisao();
        mover();
        fazerDesenho();
        atualizarPontuacao();
        setTimeout("cicloDeJogo()", ATRASO);
    }
}

function verificarSpider() {
    if ((x[0] == spider_x) && (y[0] == spider_y)) {
        points++;
        localizarSpider();
        pontuacao += 10;
        ATRASO -= ACELERAR;
        localizarObst();
        soundeffect1.play();
    }
}

function verificarObst() {
    for (var p = 0; p < carnage_x.length; p++) {
        if ((x[0] == carnage_x[p]) && (y[0] == carnage_y[p])) {
            noJogo = false;
            pontuacao -= 10;
        }
    }
    if (pontuacao < 0) {
        pontuacao = 0;
    }
}

function verificarColisao() {
    for (var z = points; z > 0; z--) {
        if ((z > 3) && (x[0] == x[z]) && (y[0] == y[z])) {
            noJogo = false;
        }
    }

    if (y[0] >= C_ALTURA) {
        noJogo = false;
    }

    if (y[0] < 0) {
        noJogo = false;
    }

    if (x[0] >= C_LARGURA) {
        noJogo = false;
    }

    if (x[0] < 0) {
        noJogo = false;
    }
}

function mover() {
    for (var z = points; z > 0; z--) {
        x[z] = x[z - 1];
        y[z] = y[z - 1];
    }

    if (paraEsquerda) {
        x[0] -= TAMANHO_PONTO;
    }

    if (paraDireita) {
        x[0] += TAMANHO_PONTO;
    }

    if (paraCima) {
        y[0] -= TAMANHO_PONTO;
    }

    if (paraBaixo) {
        y[0] += TAMANHO_PONTO;
    }
}

function fazerDesenho() {
    ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
    ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

    if (noJogo) {
        ctx.drawImage(spider, spider_x, spider_y);
        for (var i = 0; i < carnage_x.length; i++) {
            ctx.drawImage(carnage, carnage_x[i], carnage_y[i]);
        }
        for (var z = 0; z < points; z++) {
            if (z == 0) {
                ctx.drawImage(head, x[z], y[z]);
            } else {
                ctx.drawImage(body, x[z], y[z]);
            }
        }
    } else {
        fimDeJogo();
    }
}

function fimDeJogo() {
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "normal bold 24px 'Bitcount Single', sans-serif";
    ctx.fillText("Fim de Jogo!", C_LARGURA / 2, C_ALTURA / 2);

    document.getElementById("restart-button").style.display = "block";

    soundeffect4.play();
    soundeffect2.pause();
    soundeffect2.currentTime = 0;
    soundeffect3.play();
}

function atualizarPontuacao() {
    document.getElementById("pontuacao-display").textContent = pontuacao;
}

function verificarTecla(e) {
    var tecla = e.keyCode;

    if ((tecla == TECLA_ESQUERDA) && (!paraDireita)) {
        paraEsquerda = true;
        paraCima = false;
        paraBaixo = false;
    }

    if ((tecla == TECLA_DIREITA) && (!paraEsquerda)) {
        paraDireita = true;
        paraCima = false;
        paraBaixo = false;
    }

    if ((tecla == TECLA_ACIMA) && (!paraBaixo)) {
        paraCima = true;
        paraDireita = false;
        paraEsquerda = false;
    }

    if ((tecla == TECLA_ABAIXO) && (!paraCima)) {
        paraBaixo = true;
        paraDireita = false;
        paraEsquerda = false;
    }
}