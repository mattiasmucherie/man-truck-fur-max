/*******************************************************
 * MAN New Truck Generation Game
 * Copyright (C) 2019 {MAN Truck & Bus SE, Electric/Electronic Systems (EE), Max Lindner}
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Max Lindner <max.lindner@man.eu>, September 2019
 *******************************************************/

//Globale Variablen definieren
var dispMinx = 0;                                                                       //Spielfeld bzw. Display kleine x-Koordinaten festlegen
var dispMaxx = 780;                                                                     //Spielfeld bzw. Display große x-Koordianten festlegen
var dispMiny = 0;                                                                       //Spielfeld bzw. Display kleine y-Koordinaten festlegen
var dispMaxy = 460;                                                                     //Spielfeld bzw. Display große y-Koordinaten festlegen

var objectWidth = 60;                                                                   //Objektbreite (Pixel Bild) festlegen
var objectHeight = 60;                                                                  //Objekthöhe (Pixel Bild) festlegen

var truckx = 0;                                                                         //x-Startposition des Trucks festlegen
var trucky = 0;                                                                         //y-Startposition des Trucks festlegen
var aboveInity = 0;                                                                     //y-Startposition nach erfolgreicher Zielerreichung oben
//var belowInity = 440;                                                                 //y-Startpostion nach erfolgreicher Zielerreichung unten

var targetx = Math.floor(Math.random() * 32) * 20 + 20;                                 //36x-Startposition des Ziels festlegen
var targety = 400;                                                                      //y-Startposition des Ziels festlegen

var score = 0;                                                                          //Aktuell erfolgreich gefangene Ziele mit Startwert 0

var enemyPosition = [1, 10, 60, 150, 600];                                              //[1, 10, 60, 100, 150, 296] Startposition der Gegner einstellen
var enemyMovement = [2, 3, -2, 4, -3];                                                  //[2, 3, -2, 4, 5, -3] Unterschiedliche Geschwindigkeit der Feinde einstellen
var enemyPace = 5;                                                                      //Multiplikator für Feindgeschwindigkeit
var enemyPosMinx = 0;                                                                   //Minimale Feindposition in x-Richtung festlegen
var enemyPosMaxx = 720;                                                                 //Maximale Feindposition in x-Richtung festlegen
var firstEnemy = 335;                                                                   //340 Erste Feindplatzierung
var distEnemy = 65;                                                                     //40 Multiplikation mit dieser Zahl für Entfernung zum nächsten Gegner

var stepSize = 10;                                                                      //Bewegungsschrittweite bei Tastenbetätigung

var defineTact = 35;                                                                    //Define Taktung für Update und Geschwindigkeit

var audio = new Audio('loewengebruell_IAA2016.mp3');                                    //Audiodatei Löwenbrüller laden

var pressController = 40;                                                               //ASCII-Code für Controller drücken (Bewegung nach unten), 40 für Pfeiltaste nach unten auf Keyboard
var vertMaxy = 400;                                                                     //playgroundgrenze nach unten definieren
var truckMaxy = vertMaxy;
//var truckMaxy = vertMaxy - 10;                                                          //Maximal mögliche Bewegung der truck nach unten definieren
//var upArrowKey = 38;                                                                  //ASCII-Code 38 für Pfeiltaste nach oben, entfällt auf Infotainmentsystem
//var vertMiny = 0;                                                                     //playgroundgrenze nach oben definieren
//var truckMiny = 0;                                                                    //Maximal mögliche Bewegung der truck nach oben definieren
var leftController = 37;                                                                //ASCII-Code für Controller nach links (Bewegung nach links), 37 für Pfeiltaste nach links auf Keyboard
var horMinx = 0;                                                                        //playgroundgrenze nach links definieren
var truckMinx = 0;                                                                      //Maximal mögliche Bewegung der truck nach links definieren
var rightController = 39;                                                               //ASCII-Code für Controller nach rechts (Bewegung nach rechts), 39 für Pfeiltaste nach rechts auf Keyboard
var horMaxx = 720;                                                                      //playgroundgrenze nach rechts definieren
var truckMaxx = horMaxx;
//var truckMaxx = horMaxx - 10;                                                           //Maximal mögliche Bewegung des Trucks nach rechts definieren

var restartGame;                                                                        //Variable für Button "New Game"

//Spielfigur zeichnen
function drawTruck() {                                                                  //Funktion um Truck zu zeichnen
    var truck = new Image();                                                            //Variabe als Bild welche den Truck erstellt
    truck.src = 'images/truck.png';                                                     //Bild für den Truck laden
    truck.onload = function () {                                                        //Funktion um Trucl zu zeichnen
        playground.drawImage(truck, truckx, trucky);                                    //Truck zeichnen
    }
}

//Ziel zeichnen
function drawTarget() {                                                                 //Funktion um das Ziel zu zeichnen
    var target = new Image();                                                           //Variable für Bild des targets erstellen
    target.src = 'images/MAN_Loewe.png';                                                //Bild für das Ziel laden
    target.onload = function () {                                                       //Funktion um Zielfigur zu zeichnen
        playground.drawImage(target, targetx, targety);                                 //Zielfigur zeichnen
    }
}
drawTarget();                                                                           //Funktionsaufruf um Zielfigur zu zeichnen

//Feinde platzieren
function placeEnemy() {                                                                 //Funktion um Feinde zu zeichnen
    for (i = 0; i < enemyPosition.length; i++) {                                        //for-Schleife nach Anzahl der Feinde mit Länge des Arrays festlegen
        enemyPosition[i] += enemyMovement[i] * enemyPace;                               //Geschwindigkeit der Feinde einstellen
        if (enemyPosition[i] > enemyPosMaxx || enemyPosition[i] < enemyPosMinx) {       //if-Abfrage zum Standort der Feinde
            enemyMovement[i] *= -1;                                                     //Richtungswechsel
        }
        createEnemy(enemyPosition[i], firstEnemy - (i * distEnemy));                    //Funktionsaufruf um Feind zu erstellen mit x- und y-Position
    }
}

//Feinde erstellen
function createEnemy(fx, fy) {                                                          //Funktion um Feind zu erstellen
    var feind = new Image();                                                            //Variable für Bild des Feindes erstellen
    feind.src = 'images/feind.png';                                                     //Bild für die Feinde laden
    feind.onload = function () {                                                        //Funktion um Feind zu zeichnen
        playground.drawImage(feind, fx, fy);                                            //Feind zeichnen
    }
}

//Kollisionsabfrage
function checkEnemyCollison() {                                                         //Funktion zur Abfrage ob Truck mit Feind Kontakt hatte
    for (i = 0; i < enemyPosition.length; i++) {                                        //for-Schleife nach Anzahl der Feinde mit Länge des Arrays festlegen
        var enemyy = firstEnemy - (i * distEnemy);                                      //Aktuelle Feindposition in Variable speichern
        if (truckx < enemyPosition[i] + objectWidth &&                                  //Abfrage auf Kollisionen bei leichter Berührung
            truckx + objectWidth > enemyPosition[i] &&
            trucky < enemyy + objectHeight &&
            trucky + objectHeight > enemyy) {
            enemyCollision();                                                           //Funktionsaufruf Kollision mit Feind
        }
    }
}

//Kollision mit Feind
function enemyCollision() {                                                             //Funktion zur Anzeige Gameover nach einer Kollision
    clearInterval(tact);                                                                //Stillstand des Displays hervorrufen
    //$('#gameover').show();                                                              //Gameover Textaufruf
    //alert("Sterne gehören in den Himmel, nicht auf die Straße, vermeiden Sie den Kontakt.");   //Gameover Textaufruf #2
    $('#gameover').slideDown();
}

//Ziel erreicht
function targetCollision() {                                                            //Funktion nach erreichen des Ziels
    //console.log("x: " + x + "|Ziel x:" + targetx);                                    //Anzeige in der Konsole beim Entwickeln für Test auf Kontact
    //console.log("y: " + y + "|Ziel y" + targety);                                     //Anzeige in der Konsole beim Entwickeln für Test auf Kontact

    if (truckx == targetx && trucky == targety) {                                       //Abfrage auf Zielkollision
        //console.log("MAN Löwe gefangen");                                             //Anzeige Löwe gefangen beim entwickeln
        audio.play();                                                                   //Funktionsaufruf Tonausgabe Löwenbrüller

        //Neuen Loewen erzeugen und truck neu setzen
        //if (targety == belowInity) {                                                  //Funktion um Löwen nach fangen nach oben oder unten springen zu lassen, auf MMT nicht möglich da nur 3 Tastenkombinationen verwendet werden
        //  targety = aboveInity;                                                       //Wäre der Wechsel nach oben
        //  targety = belowInity;                                                       //Zielfigur immer unten auf Infotainmentsystem
        trucky = aboveInity;                                                            //Truck fängt immer oben an auf Infotainmentsystem
        //}
        //else {
        //  targety = belowInity;                                                       //Zielfigur immer unten auf Infotainmentsystem
        //}
        targetx = Math.floor(Math.random() * 32) * 20 + 20;                             //x-Position des neuen Ziels zufällig erzeugen
        score++;                                                                        //Erfolgreich gefangene Icons +1
        $('#score').html('Score: ' + score);                                            //Anzeige der aktuellen Punkte auf Display
    }
}

function restartGame() {                                                                //Funktion um ein neues Spiel zu starten
    //restartGame = window.open("file:///C:/Users/i0680/Desktop/MAN%20NTG%20Game/App1/MAN_Game.html");
    clearInterval(tact);                                                                //Takt zurücksetzen
    $('#gameover').hide();                                                              //Gameoveranzeige ausblenden
    truckx = 0;                                                                         //Truck x-Position neu
    trucky = aboveInity;                                                                //Truck y-Position neu
    score = 0;                                                                          //Score zurücksetzen
    $('#score').html('Score: ' + score);                                                //Score neu anzeigen
    targetx = Math.floor(Math.random() * 36) * 20 + 20;                                 //Target neu setzen
    init();
}

//Initialfunktion
function init() {                                                                       //Funktion zum initialisieren
    tact = window.setInterval(update, defineTact);                                      //tact bzw. Geschwindigkeit festlegen
    var gameboard = document.getElementById('leinwand');                                //Variable für Spielbrett bzw. Leinwand erzeugen
    playground = gameboard.getContext('2d');                                            //playgroundart festlegen
}

//Hauptfunktion mit Aufruf der anderen Funktionen sowie Steuerung
$(document).ready(function () {                                                         //Hauptfunktion                                                   
    tact = window.setInterval(update, defineTact);                                      //tact bzw. Geschwindigkeit festlegen
    //window.requestAnimationFrame(update);
    var spielbrett = document.getElementById('leinwand');                               //Variable für Spielbrett bzw. Leinwand erzeugen
    playground = spielbrett.getContext('2d');                                           //playgroundart festlegen

    function update() {                                                                 //Updatefunktion
        playground.clearRect(dispMinx, dispMiny, dispMaxx, dispMaxy);                   //Größe des playgrounds bzw. Displays festlegen
        drawTarget();                                                                   //Funktionsaufruf target zeichnen
        //window.requestAnimationFrame(drawTarget);
        drawTruck();                                                                    //Funktionsaufruf truck zeichnen
        //window.requestAnimationFrame(drawTruck);
        targetCollision();                                                              //Funtionsaufruf targetCollision
        checkEnemyCollison();                                                           //Funktionsaufruf prüfe Feindkollision
        placeEnemy();                                                                   //Funktionsaufruf zum platzieren der Feinde
        //window.requestAnimationFrame(placeEnemy);
        //window.requestAnimationFrame(update);
    };

    //update();

    function moveDown() {                                                               //Funktionsaufruf Bewegung nach unten
        trucky += stepSize;                                                             //Truck um stepSize nach unten bewegen
        if (trucky >= vertMaxy) {                                                       //Abfrage ob playgroundgrenze nach unten erreicht
            trucky = truckMaxy;                                                         //Maximal mögliche Bewegung nach unten
        }
    }
    
    //function moveUp() {                                                               //Funktionsaufruf Bewegung nach oben
    //    trucky -= stepSize;                                                           //Truck um stepSize nach oben bewegen
    //    if (trucky <= vertMiny) {                                                     //Abfrage ob playgroundgrenze nach oben erreicht
    //        trucky = truckMiny;                                                       //Maximal mögliche Bewegung nach oben
    //    }
    //}

    function moveLeft() {                                                               //Funktionsaufruf Bewegung nach links
        truckx -= stepSize;                                                             //Truck um stepSize nach links bewegen
        if (truckx <= horMinx) {                                                        //Abfrage ob playgroundgrenze nach links erreicht
            truckx = truckMinx;                                                         //Maximal mögliche Bewegung nach links
        }
    }

    function moveRight() {                                                              //Funktionsaufruf Bewegung nach rechts
        truckx += stepSize;                                                             //Truck um stepSize nach rechts bewegen
        if (truckx >= horMaxx) {                                                        //Abfrage ob playgroundgrenze nach rechts erreicht
            truckx = truckMaxx;                                                         //Maximal mögliche Bewegung nach rechts
        }
    }

    $(document).bind('keydown', function (evt) {                                        //Steuerung erstellen
        //console.log("Tastaturcode: " + evt.keyCode);                                  //Anzeige des ASCII-Codes der Tasten in der Konsole zum entwickeln
        switch (evt.keyCode) {                                                          //Switch-Case Abfrage auf Tastendruck

            // Drechdrücksteller drücken bzw. Pfeiltaste nach unten
            case pressController:                                                       //Drehdrücksteller gedrückt
                moveDown();                                                             //Funktionsaufruf nach unten bewegen
                break;

            //Funktion entfällt auf Infotainment System, Pfeiltaste nach oben
            //case upArrowKey:                                                          //Pfeiltaste nach oben gedrückt
            //    moveUp();                                                             //Funktionsaufruf nach oben bewegen
            //    break;

            // Pfeiltaste nach links
            case leftController:                                                        //Drehdrücksteller nach links
                moveLeft();                                                             //Funktionsaufruf nach links bewegen
                break;

            // Pfeiltaste nach rechts
            case rightController:                                                       //Drehdrücksteller nach rechts
                moveRight();                                                            //Funktionsaufruf nach rechts bewegen
                break;
        }
    });
});
