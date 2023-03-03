// Creamos variables de todo lo que vamos a usar

var time = new Date();
var deltaTime = 0;

var sueloY = 22
var velY = 0
var impulso = 900
var gravedad = 2500

var dinoPosX = 42
var dinoPosY = sueloY

var sueloX = 0
var velEscenario = 1200/3
var gameVel = 1

var parado = false
var saltando = false

var contenedor 
var dino
var textScore 
var score = 0
var suelo 
var gameOver

let tiempoHastaObstaculo = 0.7
let tiempoObstaculoMin = 0.7
let tiempoObstaculoMax = 1.8
let obstaculoPosY = 16
var obstaculos = []

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;


// Creamos un loop para mantener el juego funcionando
if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(Init, 1);
}else(document.addEventListener("DOMContentLoaded", Init))

function Init(){
    time = new Date();
    Start();
    Loop();
}

function Loop(){
    deltaTime = (new Date() - time) / 1000;
    time = new Date()
    Update()
    requestAnimationFrame(Loop)
}

// estas funciones detectan los cambios que se hagan para mostrarlos en pantalla

function Update(){

    if(parado) return

    moverDinosaurio()
    moverSuelo()

    decidirCrearObstaculos()
    moverObstaculos()

    decidirCrearNubes()
    crearNube()
    moverNubes()

    detectarColision()


    velY -= gravedad * deltaTime
}

function Start(){
    gameOver = document.querySelector(".game-over")
    suelo = document.querySelector(".suelo")
    contenedor = document.querySelector(".contenedor")
    textScore = document.querySelector(".score")
    dino = document.querySelector(".dino")
    document.addEventListener("keydown", handleKeyDown)

}

// con estas lineas hacemos que el dinosaurio salte
function handleKeyDown(ev){
    if(ev.keyCode == 32){
        Saltar()
    }
}

function Saltar(){
    if(dinoPosY === sueloY){
        saltando = true
        velY = impulso
        dino.classList.remove("dino-corriendo")
    }
}


// Creamos el movimiento del dinosaurio al saltar
function moverDinosaurio(){
    dinoPosY += velY * deltaTime
    if(dinoPosY < sueloY){
        TocarSuelo()
    }
    dino.style.bottom = dinoPosY+"px"
}


// creamos una funcion para cuando el dinosaurio toque el suelo
function TocarSuelo(){
    dinoPosY = sueloY
    velY = 0
    if(saltando){
        dino.classList.add("dino-corriendo")
    }
    saltando = false
}



// Generamos el movimento de suelo 
function moverSuelo(){
    sueloX += calcularDesplazamiento()
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px"
}

function calcularDesplazamiento(){
    return velEscenario * deltaTime * gameVel
}



// Creamos los obstaculos que el dinosaurio tiene que saltar
function decidirCrearObstaculos(){
    tiempoHastaObstaculo -= deltaTime
    if(tiempoHastaObstaculo <= 0){
        crearObstaculos()
    }
}

function crearObstaculos(){
    var obstaculo = document.createElement("div")
    contenedor.appendChild(obstaculo)
    obstaculo.classList.add("cactus")
    if(Math.random() > 0.5) obstaculo.classList.add("cactus2");
    obstaculo.posX = contenedor.clientWidth
    obstaculo.style.left = contenedor.clientWidth + "px"

    obstaculos.push(obstaculo)
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel

}

// le damos movimiento a los obstaculos hacia el dinosaurio
function moverObstaculos(){
    for(var i =  obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth){
            obstaculos[i].parentNode.removeChild(obstaculos[i])
            obstaculos.splice(i, 1)
            ganarPuntos()
        }else{
            obstaculos[i].posX -= calcularDesplazamiento()
            obstaculos[i].style.left = obstaculos[i].posX + "px"
        }
    }
}

// Creamos las nubes de fondo

function decidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if(tiempoHastaNube <= 0) {
        crearNube();
    }
}

function crearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth+"px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px";
    
    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel;
}

function moverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if(nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        }else{
            nubes[i].posX -= calcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX+"px";
        }
    }
}




//Creamos las colisiones para que el dinosaurio toque los cactus

function detectarColision(){
    for(var i = 0; i < obstaculos.length; i++){
        if(obstaculos[i].posX > dinoPosX + dino.clientWidth){
            break
        }else{
        if(esColision(dino, obstaculos[i], 10, 30, 15, 20)){
            gameOver()
        }
    }
  }  
}

function esColision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft){
    var aRect = a.getBoundingClientRect()
    var bRect = b.getBoundingClientRect()

    //con estas lineas comprobamos si hay colision entre a y b: dinosaurio y obstaculos
    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    )
}


// creamos al dinosaurio estrellado
function estrellarse(){
    dino.classList.remove("dino-corriendo")
    dino.classList.add("dino-estrellado")
    parado = true
}


//Creamos el sistema de puntuacion

function ganarPuntos(){
    score++
    textScore.innerText = score

    if(score == 20){
        gameVel = 1.2;
        contenedor.classList.add("mediodia");
    }else if(score == 40) {
        gameVel = 1.5;
        contenedor.classList.add("tarde");
    } else if(score == 90) {
        gameVel = 2.5;
        contenedor.classList.add("noche");
    }
    suelo.style.animationDuration = (3/gameVel)+"s";
}


//El fin del juego al chocar contra un cactus

function gameOver(){
    estrellarse()
    gameOver.style.display = "block"

}