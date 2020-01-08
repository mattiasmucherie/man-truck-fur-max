var x = 0;
var y = 0;

$(document).ready(function () {
    var spielbrett = document.getElementById('leinwand');
    spielfeld = spielbrett.getContext('2d');
    var spielfigur = new Image();
    spielfigur.src = 'images/spielfigur.png';

    spielfigur.onload = function () {
        spielfeld.drawImage(spielfigur, x, y);
    }
});