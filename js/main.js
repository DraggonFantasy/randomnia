var DIR_LEFT = 0;
var DIR_RIGHT = 1;
var DIR_FORWARD = 2;
var DIR_BACKWARD = 3;

var GAME_END_DEATH = 0;

var STATE_NEW_GAME = 0;
var STATE_IN_GAME = 1;
var STATE_DEATH = 2;

var KEYCODE_LEFT = 37;
var KEYCODE_UP = 38;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;

var rightBlock;
var specials = [];
var roomIcon;
var roomDescr;
var roomName;
var mainHero;

var faces = ["images/portraits/1.png", "images/portraits/2.png", "images/portraits/3.png"];

window.onload = function()
{	
	initFaces();
	document.getElementById("startGame").onclick = startNewGame;
	
	initControls();
	initSpecials();
	initRoomInfo();
	
	currentRoom = new RoomEmpty();
}

function initFaces()
{
	var faceWrap = document.getElementById("startGame_portraitsWrap");
	
	var select = function(r) { return function() { r.checked = true; } };
	
	for(var i = 0; i < faces.length; ++i)
	{
		var radio = document.createElement('input');
		radio.type = "radio";
		radio.name = "faceSelect";
		radio.value = i;
	
		var img = document.createElement('img');
		img.src = faces[i];
		img.style.border = "1px white solid";
		img.onclick = select(radio); 
		
		faceWrap.appendChild(radio);
		faceWrap.appendChild(img);
	}
}

function startNewGame()
{
	var name = document.getElementById("startGame_heroName").value;
	if(name == "")
	{
		alert("Please, enter the name of your hero.");
		return;
	}
	var selectedFace = -1;
	var faceSelectors = document.getElementsByName("faceSelect");
	for( var selector in faceSelectors )
	{
		if( !faceSelectors.hasOwnProperty( selector ) ) continue;
		
		var s = faceSelectors[ selector ];
		if( s.checked )
		{
			selectedFace = s.value;
		}
	}
	if(selectedFace == -1)
	{
		alert("Please, select a face of your hero.");
		return;
	}
	
	
	mainHero = new Hero("heroData", name, selectedFace);
	mainHero.updateData();
	mainHero.updateAchievements();
	displayGameState( STATE_IN_GAME );
	/*document.getElementById("newGame").style.display = "none";
	
	var elems = document.getElementsByClassName("inGame");
	for(var i = 0; i < elems.length; ++i)
	{
		elems[i].style.display = "block";
	}*/
}

function saveGame()
{
	if( !(currentRoom instanceof RoomEmpty) )
	{
		alert("You can only save in empty rooms");
		return;
	}
	
	var data = {};
	data.hero = mainHero;
	data.room = currentRoom;
	
	prompt("Click Ctrl+C to copy save data", JSON.stringify(data) );
}

function loadGame()
{
	var data = JSON.parse( prompt("Paste save data here") );
	if(data == null) return;
	mainHero = new Hero("heroData", "");
	currentRoom = new RoomEmpty();
	
	for(var prop in data.hero)
	{
		if( data.hero.hasOwnProperty(prop) )
		{
			mainHero[prop] = data.hero[prop];
		}		
	}
	for(var prop in data.room)
	{
		if( data.room.hasOwnProperty(prop) )
		{
			currentRoom[prop] = data.room[prop];
		}
	}
	
	mainHero.updateData();
	mainHero.updateAchievements();
}

function endGame(reason)
{
	switch(reason)
	{
		case GAME_END_DEATH:
			document.getElementById("deathGame_message").innerHTML = "RIP, <b>" + mainHero.getName() + "</b>.<br>You were a good Hero, Randomnia will never forget you and everything you did...";
			displayGameState( STATE_DEATH );
		break;
	}
}

function displayGameState(state)
{
	document.getElementById("newGame").style.display = ((state === STATE_NEW_GAME) ? "block" : "none");
	document.getElementById("deathGame").style.display = ((state === STATE_DEATH) ? "block" : "none");
	
	var elems = document.getElementsByClassName("inGame");
	for(var i = 0; i < elems.length; ++i)
	{
		elems[i].style.display = ((state === STATE_IN_GAME) ? "block" : "none");
	}
}

function initControls()
{
	var up 		= document.getElementById("controlUp");
	var down 	= document.getElementById("controlDown");
	var left 	= document.getElementById("controlLeft");
	var right	= document.getElementById("controlRight");
	
	var save 	= document.getElementById("saveGame");
	var load 	= document.getElementById("loadGame");
	
	up.onclick 		= function() { gotoNextRoom( DIR_FORWARD 	); };
	down.onclick	= function() { gotoNextRoom( DIR_BACKWARD ); };
	left.onclick		= function() { gotoNextRoom( DIR_LEFT 	); };
	right.onclick 	= function() { gotoNextRoom( DIR_RIGHT	); };
	
	onkeyup = function(e)
	{
		switch( e.keyCode)
		{
		case KEYCODE_LEFT:
			left.onclick();
			return false;
		break;
		case KEYCODE_RIGHT:
			right.onclick();
			return false;
		break;
		case KEYCODE_UP:
			up.onclick();
			return false;
		break;
		case KEYCODE_DOWN:
			down.onclick();
			return false;
		break;
		}
	}
	
	save.onclick	= function() { saveGame(); };
	load.onclick	= function() { loadGame(); };
}

function initSpecials()
{
	var f = function(i) { return function() { currentRoom.doSpecial(i); }; }
	for(var i = 0; i < 9; ++i)
	{
		specials[i] = document.getElementById("special" + i);
		specials[i].onclick = f(i);
	}
}

function initRoomInfo()
{
	roomIcon  = document.getElementById("roomImage");
	roomName  = document.getElementById("roomName");
	roomDescr = document.getElementById("roomDescr");
	rightBlock = document.getElementById("rightInfo");
}

function gotoNextRoom(direction)
{
	if( currentRoom == null ) currentRoom = new RoomEmpty();
	if( currentRoom.isMovementBlocked() )
	{
		alert("You can't go further for some reason.");
		return;
	}
	mainHero.tempEffectsStep();
	
	
	if( isOppositeDir(direction, mainHero.prevDirection) )
	{
		var t = currentRoom;
		setRoom( mainHero.prevRoom );
		mainHero.prevRoom = t;
		mainHero.prevDirection = direction;
		return;
	}

	mainHero.prevDirection = direction;
	mainHero.prevRoom = currentRoom;
	
	
	mainHero.achieve("crawler");
	var nextRoom = currentRoom.genNextRoom(direction);
	if(nextRoom != null) currentRoom = nextRoom;
}

function setRoom(room)
{
	currentRoom = room;
	currentRoom.updateView();
}

function isOppositeDir(dir1, dir2)
{
	// Another variant: compare modules by 2 (a % 2) - if it's different -> directions are opposite (see DIR_... 'constants')
	return (dir1 == DIR_FORWARD && dir2 == DIR_BACKWARD) || (dir2 == DIR_FORWARD && dir1 == DIR_BACKWARD) || (dir1 == DIR_LEFT && dir2 == DIR_RIGHT) || (dir2 == DIR_LEFT && dir1 == DIR_RIGHT);
}

function itemUse(item, index)
{
	if(currentRoom == null) currentRoom = new RoomEmpty();
	currentRoom.handleItem(item, index);
	//alert( items[item].name );
}

function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min)) + min;
}


function toggleAchievements()
{
	var a = document.getElementById("achievements");
	a.style.display = (a.style.display == "none") ? "block" : "none";
}