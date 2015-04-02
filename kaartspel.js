// Kaart object
var Kaart = function() {
	this.nieuw();
};

Kaart.prototype = function() {
	this.value = 1;
	this.type = 1;
}
Kaart.prototype.nieuw = function() {

	this.value = Math.floor(Math.random() * 13)
	this.type = Math.floor(Math.random() * 4) + 1

	while( checkStockDuplicate(this.value+''+this.type) !=false ) {
		this.value = Math.floor(Math.random() * 13)
		this.type = Math.floor(Math.random() * 4) + 1	
	}
	addToStock(this.value+''+this.type);
};


Kaart.prototype.show = function() {
	return (type[this.type] + " " + waarde[this.value] + "(" + charWaarde[this.value] + charType[this.type] + ")");
};

Kaart.prototype.showType = function() {
	return (type[this.type]);
};

// Kaart properties
var waarde = {
	0 : "Twee",
	1 : "Drie",
	2 : "Vier",
	3 : "Vijf",
	4 : "Zes",
	5 : "Zeven",
	6 : "Acht",
	7 : "Negen",
	8 : "Tien",
	9 : "Boer",
	10 : "Vrouw",
	11 : "Koning",
	12 : "Aas"
};

var type = {
	1 : "Harten",
	2 : "Schoppen",
	3 : "Ruiten",
	4 : "Klaveren"
};
var charWaarde = {
	0 : "2",
	1 : "3",
	2 : "4",
	3 : "5",
	4 : "6",
	5 : "7",
	6 : "8",
	7 : "9",
	8 : "10",
	9 : "B",
	10 : "V",
	11 : "K",
	12 : "A"
};

var charType = {
	1 : "♥",
	2 : "♠",
	3 : "♦",
	4 : "♣"
};

// Stock array
var stock = []
if (supports_html5_storage() == true && Array.isArray(stock) == true && stock.length >= 2) {
	stock = localStorage.getItem("stock").split(",");
}

addToStock = function(string){
	stock.push(string);
	localStorage.setItem("huidigeKaart", JSON.stringify(huidigeKaart) );
	localStorage.setItem("nieuweKaart", JSON.stringify(nieuweKaart) );
}
checkStockDuplicate = function(string){
	if ( stock.length >= 52 ) { // 52 Zoveel spelkaarten zitten er in een spel
		return false;
	}
	if ( stock.indexOf(string) != -1 ) {
		return true;
	} else {
		return false;
	}
}

clearStock = function(){
	stock = [];
}


// Check for html5 storage
function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

// Wrapper console message, shows text + current score
function showMessage(string) {
	setTimeout(function(){ console.log(string); }, 100);
}

// Score check
var score = 0;
function updateScore(key) {
/****** Pijltje omlaag ******/
	if (key == 40) {

		// Win, kaart is inderdaad lager
		if ( huidigeKaart.value > nieuweKaart.value) {
			win( "Correct, de " + nieuweKaart.show() + " is lager dan de " + huidigeKaart.show() );
		// Waarde kaart is gelijk, check type
		} else if ( huidigeKaart.value == nieuweKaart.value) {

			// Win, waarde is inderdaad beter
			if ( huidigeKaart.type < nieuweKaart.type ) {
				
				win( "Een " + nieuweKaart.show() + ", " + huidigeKaart.showType() + " beats " + nieuweKaart.showType() );

			// Lose
			} else {
				lose( "Helaas, een " + nieuweKaart.show() + ", " + nieuweKaart.showType() + " beats " + huidigeKaart.showType() );
			}
			
		// Lose, kaart is hoger
		} else {
			lose( "Helaas, de " + nieuweKaart.show() + " is hoger dan je " + huidigeKaart.show() );
		}
	}


/****** Pijltje omhoog ******/
	if (key == 38) {
		
		// Win, kaart is inderdaad hoger
		if ( huidigeKaart.value < nieuweKaart.value) {
			win( "Correct, de " + nieuweKaart.show() + " is hoger dan je " + huidigeKaart.show() );

		// Waarde kaart is gelijk, check type
		} else if ( huidigeKaart.value == nieuweKaart.value) {

			// Win, waarde is inderdaad beter
			if ( huidigeKaart.type < nieuweKaart.type ) {
				
				win( "Een " + nieuweKaart.show() + ", " + huidigeKaart.showType() + " beats " + nieuweKaart.showType()  );

			// Lose
			} else {
				lose( "Helaas, een " + nieuweKaart.show() + ", " + nieuweKaart.showType() + " beats " + huidigeKaart.showType() );
			}
			
		// Lose, kaart is lager
		} else {
			lose( "Helaas, de " + nieuweKaart.show() + " is lager dan je " + huidigeKaart.show() );
		}
	}
	nieuweKaart.nieuw();
}

function win(string) {
	score+= 1*multiplier;
	multiplier++;
	huidigeKaart.nieuw();

	showMessage(string + ". Je nieuwe kaart is een " + huidigeKaart.show() )
}
function lose(string) {
	multiplier = 0;
	huidigeKaart.nieuw();
	showMessage(string + ". Je nieuwe kaart is een " + huidigeKaart.show() )
}

var huidigeKaart = {};
var nieuweKaart = {};
var gameIsActive = false;

function quitGame() {
	clearStock();
	gameIsActive = false;

	localStorage.removeItem("huidigeKaart");
	localStorage.removeItem("nieuweKaart");
	localStorage.removeItem("stock");

	showMessage("Alle kaarten zijn verdeeld, eens even kijken hoeveel punten je hebt verdient")	
	showMessage("...")	

	if (score < 10) {
		showMessage("Wow, " + score + " punten, dat is wel erg slecht...")
	} else if (score < 100) {
		showMessage( score + " punten, niet verkeerd.")
	} else if (score < 250) {
		showMessage( "MONSTERSCORE !!!! " + score + " punten, dat is wel echt bizar veel!")
	} else {
		showMessage( score + " punten... Cheater !")
	}
	showMessage("Druk op spatie om opniew te beginnen.")
	showMessage("\r\n")
}
	
function startGame() {
	score = 0;
	multiplier=1;
	gameIsActive = true;
	
	huidigeKaart = new Kaart;
	nieuweKaart = new Kaart;

	console.log("Wat we gaan spelen is een Hoger-of-Lager. Je krijgt een kaart toegespeeld en ")
	console.log("vervolgend moet je gokken of de volgende kaart, hoger of lager is. Dit doe je")
	console.log("met pijltjes toetsen. Iedere kaart komt maar 1 keer voor en het spel stopt wanneer")
	console.log("alle kaarten op zijn. Of wanneer je opnieuw begint door op spatie te drukken.")
	console.log("\r\n")
	console.log("Je eerste kaart is een " + huidigeKaart.show())
};


// Controller
var controller = function(event){
	if (event.keyCode != 0) {
		key = event.keyCode;
	} else {
		key = event.charCode;
	}

	// Spatiebalk gedrukt
	if (key == 32) {
		startGame();
	}
	if (gameIsActive == true && (key == 40 || key == 38)) {
		
		if (stock.length < 52 && stock.length > 0) {
			updateScore(key)
		} else {
			quitGame();
		}

		if (supports_html5_storage() == true) {
			localStorage.setItem("huidigeKaart", JSON.stringify(huidigeKaart) );
			localStorage.setItem("nieuweKaart", JSON.stringify(nieuweKaart) );
			localStorage.setItem("stock", stock.toString() );
		}
	}
};
window.onkeydown = controller;


if (supports_html5_storage() == true && Array.isArray(stock) == true && stock.length >= 2) {
	if ( localStorage.getItem("huidigeKaart") != "undefined" && localStorage.getItem("nieuweKaart") != "undefined" ) {
		// Kaart .show functie doet het niet !? WAAROM OMEO MEO MEOE M? ???????????
		huidigeKaart = JSON.parse(localStorage.getItem("huidigeKaart"));
		nieuweKaart = JSON.parse(localStorage.getItem("nieuweKaart"));		

		console.log("Je hebt je vorige spel nog niet afgemaakt, druk spatie om opnieuw te beginnen,");
		console.log("of speel gewoon verder met je " + huidigeKaart.show());
	} else {
		quitGame();

		console.log("Druk op spatie om een nieuw spel te starten");
	}
} else {
	console.log("Druk op spatie om een nieuw spel te starten");
}

