var AbstractRoom;
var RoomEmpty;
var RoomFight;
var RoomChest;
var currentRoom;

var roomTypes = [];


(function()
{

var SPECIAL_ATTACK = 0;
var SPECIAL_DEFENSE = 1;
var SPECIAL_TALK	= 2;

var SPECIAL_APPLE 	= 0;
var SPECIAL_SEARCH 	= 8;
var SPECIAL_OPEN	= 7;

var SPECIAL_HEALTH = 0;
var SPECIAL_POWER = 1;

var SPECIAL_ITEM = 2;
var SPECIAL_TELEPORT = 3;
var SPECIAL_GOLD = 4;
var SPECIAL_SUPER_POWER = 5;

//{ ABSTRACT ROOM

AbstractRoom = function()
{
	rightBlock.innerHTML = "";
	this.specials = [];
	this.setName("");
	this.setDescription("");
	this.setIcon(null);
	for(var i = 0; i < 9; ++i)
	{
		this.setSpecialIcon(i, null);
	}
}
AbstractRoom.prototype.updateView = function()
{
	this.setName( this.name );
	this.setDescription( this.descr );
	this.setIcon( this.iconSrc );
	for(var i = 0; i < 9; ++i)
	{
		this.setSpecialIcon(i, this.specials[i] );
	}
}
AbstractRoom.prototype.setDescription = function(descr)
{
	this.descr = descr;
	roomDescr.innerHTML = descr;
}
AbstractRoom.prototype.setName = function(name)
{
	this.name =  name;
	roomName.innerHTML = name;
}
AbstractRoom.prototype.setIcon = function(iconSrc)
{
	this.iconSrc = iconSrc;
	var vis = "inline-block";
	if(iconSrc == null || iconSrc == "")
	{
		iconSrc = "";
		vis = "none";
	}
	roomIcon.src = iconSrc;
	roomIcon.style.display = vis;
}
AbstractRoom.prototype.setSpecialIcon = function(i, iconSrc)
{
	this.specials[i] = iconSrc;
	if(iconSrc == null || iconSrc == "")
	{
		specials[i].style.backgroundImage = "none";
	} else
	{
		specials[i].style.backgroundImage = "url(" + iconSrc + ")";
	}
}
AbstractRoom.prototype.handleItem = handleItemDefault;
AbstractRoom.prototype.doSpecial = doNothingSpecial;
AbstractRoom.prototype.genNextRoom = genRandomRoom;
AbstractRoom.prototype.isMovementBlocked = function()
{
	return false;
}
//}

//{ EMPTY ROOM

RoomEmpty = function()
{
	AbstractRoom.apply(this, arguments);
	this.setIcon(null);
	this.setDescription("You see nothing, but the darkness and emptiness, that surrounds you at this long corridor. The only way is to go further and see what is going to be there.");
	this.setName("Dark, Grim corridor");
}
RoomEmpty.prototype = Object.create( AbstractRoom.prototype );
//}

//{ SIMPLE ROOM

RoomSimple = function(name, text, icon)
{
	icon = icon || null;
	AbstractRoom.apply(this, arguments);
	this.setIcon(icon);
	this.setDescription(text);
	this.setName(name);
}
RoomSimple.prototype = Object.create( AbstractRoom.prototype );
//}

//{ FIGHT ROOM

RoomFight = function()
{
	AbstractRoom.apply(this, arguments);
	mainHero.achieve("monstersMet");
	
	//var monster = {iconSrc: "images/monsters/goblin.gif", descr: "Goblin is small and thin creature with a club in a hand. It's dancing a strange battle dance, maybe trying to scare you.", name: "Goblin"};
	var monsterType = getRandomInt(0, monsterTypes.length);
	
	if( mainHero.monsterTypesMet[ monsterType ] === undefined )
	{
		mainHero.achieve("differentMonstersMet");
		mainHero.monsterTypesMet[ monsterType ] = 1;
	}
	
	this.setMonster( new monsterTypes[ monsterType ]() );
	/*this.monster = new monsterTypes[ monsterType ]();	
	var monster = this.monster;
	
	this.setIcon( monster.iconSrc );
	this.setDescription("You see a " + monster.name + " in front of you.<br>" + monster.descr);
	this.setName("Encounter!");
	// TODO: special icons
	this.setSpecialIcon(SPECIAL_ATTACK, "images/icons/special_attack.png");
	this.setSpecialIcon(SPECIAL_DEFENSE, "images/icons/special_def.png");
	this.setSpecialIcon(SPECIAL_TALK, "images/icons/special_talk.png");*/
}
RoomFight.prototype = Object.create(AbstractRoom.prototype);
RoomFight.prototype.setMonster = function( mon )
{
	this.monster = mon;
	var monster = this.monster;
	
	this.setIcon( monster.iconSrc );
	this.setDescription("You see a " + monster.name + " in front of you.<br>" + monster.descr);
	this.setName("Encounter!");
	// TODO: special icons
	this.setSpecialIcon(SPECIAL_ATTACK, "images/icons/special_attack.png");
	this.setSpecialIcon(SPECIAL_DEFENSE, "images/icons/special_def.png");
	this.setSpecialIcon(SPECIAL_TALK, "images/icons/special_talk.png");
}
RoomFight.prototype.isMovementBlocked = function()
{
	return true;
}
RoomFight.prototype.doSpecial = function(num)
{
	switch(num)
	{
		case SPECIAL_ATTACK:
			var dmg = getRandomInt(0, mainHero.power);
			
			rightBlock.innerHTML += "<span class='heroDamage'><br>You hit the " + this.monster.name + " and made " + dmg + " damage!</span>";
			
			this.monster.beAttacked( dmg );
			mainHero.tempEffectsStep();
		break;
		case SPECIAL_DEFENSE:
			var regen = getRandomInt(0, Math.floor(mainHero.power / 3) );
			
			rightBlock.innerHTML += "<span class='heroRegen'><br>You were defensing and regenerated " + regen + " health</span>";
			
			mainHero.setHealth( mainHero.getHealth() + regen );
			mainHero.tempEffectsStep();
		break;
		case SPECIAL_TALK:
			if( Math.random() <= 0.5 )
			{
				var k = this.monster.damage + this.monster.health;
				var coinsWish = getRandomInt( k, 10 * k );
				if( mainHero.getCoins() >= coinsWish )
				{
					alert("You gave the " + this.monster.name + " " + coinsWish + " coins and it ran away");
					mainHero.setCoins( mainHero.getCoins() - coinsWish );
					currentRoom = new RoomEmpty();
					return;
				} else
				{
					alert("You have nothing to offer to " + this.monster.name);
				}
			} else
			{
				alert("The " + this.monster.name + " doesn't want to negotiate, it WANTS WAAAAAAR!");
			}
		break;
	}
	var log = {};
	var dmg = this.monster.attack(mainHero, log);
	rightBlock.innerHTML += "<span class='monsterDamage'><br>" + this.monster.name + " hit you and made " + dmg + " damage!</span>";
	if(log.extraMessage != undefined) rightBlock.innerHTML += "<span class='monsterDamage'><br>" + log.extraMessage + "</span>";
	rightBlock.scrollTop = rightBlock.scrollHeight;
	
	if( !this.monster.isAlive() )
	{
		var goldInc = getRandomInt(0, mainHero.power);
		currentRoom = new RoomSimple("Victory!", "Congratulations, brave hero! You've successfully defeated evil creature from bad minds of Randomnia!<br>" + 
									"Now you can go further.<br><br><span class='bonus'>+" + goldInc + " coins</span>");
		mainHero.setCoins( mainHero.getCoins() + goldInc );
		mainHero.achieve("monstersKilled");
		if( this.monster instanceof MonsterShamanZago )
		{
			mainHero.achieve("zagoShaman");
		}
	}
}

RoomFight.prototype.handleItem = function(item, index)
{
	switch(item)
	{
		case ITEM_WHITE_FLAG:
			setRoom( new RoomEmpty() );
			alert("You waved white flag, indicating that you're giving up. " + this.monster.name + " liked your flag, took it and run away.");
			mainHero.removeItemAt(index);
		break;
		case ITEM_WISH_GOGGLES:
			var mon = new monsterTypes[ getRandomInt(0, monsterTypes.length) ]();
			alert("You wore goggles and " + this.monster.name + " transforms to " + mon.name );
			this.setMonster(mon);
			if( Math.random() < 0.4 )
			{
				alert("Goggles disappeared.");
				mainHero.removeItemAt(index);
			}
		break;
		default:
			handleItemDefault.apply(this, [item, index]);
		break;
	}
}
//}

//{ APPLETREE ROOM

RoomAppletree = function()
{
	AbstractRoom.apply(this, arguments);
	this.searched = false;
	this.setIcon("images/room/appletree.png");
	this.setDescription("You are standing in front of beautiful and strange apple tree. It looks very confusing, but the apples from this tree looks very nice and tasty.");
	this.setName("Strange appletree");
	
	this.setSpecialIcon(SPECIAL_APPLE, "images/icons/special_apple.png");
	this.setSpecialIcon(SPECIAL_SEARCH, "images/icons/special_search.png");
	
	mainHero.achieve("appleTree");
}
RoomAppletree.prototype = Object.create( AbstractRoom.prototype );

RoomAppletree.prototype.doSpecial = function(num)
{
	switch(num)
	{
		case SPECIAL_APPLE:
			mainHero.giveItem( ITEM_APPLE );
			if( Math.random() < 0.3 )
			{
				return;
			}
			alert("You took an apple from the tree. Suddenly, all other apples on the tree disappeared. Maybe, you don't need more apples yet. Not now.");
			currentRoom = new RoomAppletreeEmpty();
		break;
		case SPECIAL_SEARCH:
			if( this.searched == true )
			{
				alert("You already tried to find something here.");
			} else
			{
				if( Math.random() < 0.1 )
				{
					var i = getRandomInt(0, items.length);
					alert("You examined the tree for interesting stuff and found " + items[i].getName() + "!" );
				} else
				{
					alert("You found nothing interesting here.");
				}
			}
			this.searched = true;
		break;
	}
}

//}

//{ EMPTY APPLETREE ROOM
RoomAppletreeEmpty = function()
{
	AbstractRoom.apply(this, arguments);
	this.searched = false;
	this.setIcon("images/room/appletree_empty.png");
	this.setDescription("There are no apples on this tree any more.");
	this.setName("Strange appletree");
	
	this.setSpecialIcon(SPECIAL_SEARCH, "images/icons/special_search.png");
}
RoomAppletreeEmpty.prototype = Object.create( AbstractRoom.prototype );

RoomAppletreeEmpty.prototype.doSpecial = function(num)
{
	switch(num)
	{
		case SPECIAL_SEARCH:
			if( this.searched )
			{
			
			}
			if( confirm("You examined the tree for interesting stuff and found a hollow! Do you want to look what's inside?" ) )
			{
				if( Math.random() < 0.1 )
				{
					alert("You found a beautiful and shiny Golden Apple. Interesting, what does it taste like?");
					mainHero.giveItem( ITEM_GOLDEN_APPLE );
				} else
				{
					alert("You were attacked by inhabitants of the hole. It could be worse. Maybe...");
					currentRoom = new RoomFight();
					currentRoom.setMonster( new monsterTypesApple[ getRandomInt( 0, monsterTypesApple.length ) ] );
				}
			} else
			{
				
			}
		this.searched = true;
		break;
	}
}

//}

//{ CHEST ROOM

RoomChest = function()
{
	AbstractRoom.apply(this, arguments);
	this.setIcon("images/room/chest.png");
	this.setDescription("The big chest is standing right in the middle of corridor. Maybe, you should look what's inside.");
	this.setName("Chest with goodies");
	
	this.setSpecialIcon(SPECIAL_OPEN, "images/icons/special_key.png");
}
RoomChest.prototype = Object.create( AbstractRoom.prototype );
RoomChest.prototype.doSpecial = function(num)
{
	switch(num)
	{
		case SPECIAL_OPEN:
			var goodies = getRandomInt(0, 2);
			switch(goodies)
			{
				case 0:
					var gold = getRandomInt(1, 5 * mainHero.power );
					mainHero.setCoins( mainHero.getCoins() + gold );
					alert("You found " + gold + " coins in the chest!");
				break;
				case 1:
					var item = getRandomInt(0, items.length);
					mainHero.giveItem(item);
					alert("You found " + items[item].name + " in the chest!" );
				break;
			}
			currentRoom = new RoomEmpty();
		break;
	}
}

//}

//{ DOOR ROOM

RoomDoor = function()
{
	AbstractRoom.apply(this, arguments);
	this.setIcon("images/room/door.png");
	this.setDescription("You see a closed door. It's pretty strange door, because there are no walls around it - it's just standing surrounded by air. Can it point it somewhere?..");
	this.setName("The Door");
	this.opened = false;
}
RoomDoor.prototype = Object.create( AbstractRoom.prototype );
RoomDoor.prototype.genNextRoom = function(dir)
{
	if(dir == DIR_FORWARD)
	{
		if( this.opened )
		{
			mainHero.setRegion( (new regions[ getRandomInt(0, regions.length) ]()) );
			return new RoomEmpty();
			// RETURN SUPER DUPER ROOM
		} else
		{
			alert("This door is locked. Maybe you should try to find a key somewhere...");
			return null;
		}
	} else 
	{
		return AbstractRoom.prototype.genNextRoom(dir);
	}
}
RoomDoor.prototype.handleItem = function(item, index)
{
	switch(item)
	{
		case ITEM_DOOR_KEY:
			this.opened = true;
			alert("You've opened a door");
			mainHero.removeItemAt(index);
		break;
		default:
			AbstractRoom.prototype.handleItem(item, index);
		break;
	}
}

//}

//{ FOUNTAIN ROOM

//}

//{ LUCK ROOM

//}

//{ CLOSED ROOM

//}

//{ TRAINING ROOM

//}

//{ RICH ROOM

//}

//{ TRADER ROOM

RoomTrader = function()
{
	AbstractRoom.apply(this, arguments);
	this.priceHealth = getRandomInt(50, 200);
	this.pricePower = getRandomInt(200, 800);
	
	this.setIcon("images/room/trader.gif");
	this.setName("Trader");
	this.setDescription("The guy in shiny golden clothes is standing in the middle of corridor. There is a table with goods near him. 'Come and buy something, sir!' - he smiles.");

	this.setSpecialIcon(SPECIAL_HEALTH, "images/icons/special_health.png");
	this.setSpecialIcon(SPECIAL_POWER, "images/icons/special_power.png");
}
RoomTrader.prototype = Object.create( AbstractRoom.prototype );

RoomTrader.prototype.doSpecial = function(num)
{
	switch(num)
	{
		case SPECIAL_HEALTH:
			if( mainHero.getCoins() >= this.priceHealth )
			{
				mainHero.setCoins( mainHero.getCoins() - this.priceHealth );
				mainHero.setMaxHealth( mainHero.getMaxHealth() + 15 );
				mainHero.setHealth( mainHero.getMaxHealth() );
			} else
			{
				alert("Extra health costs " + this.priceHealth + " coins");
			}
		break;
		case SPECIAL_POWER:
			if( mainHero.getCoins() >= this.pricePower )
			{
				mainHero.setCoins( mainHero.getCoins() - this.pricePower );
				mainHero.setPower( mainHero.getPower() + 1 );
			} else
			{
				alert("Extra willpower costs " + this.pricePower + " coins");
			}
		break;
		break;
	}
}
//}

//{ ROOM GENIE

RoomGenie = function()
{
	AbstractRoom.apply(this, arguments);
	this.wishes = 3;
	
	this.setIcon("images/room/genie.png");
	this.setName("Genie");
	this.setDescription("The Genie asked you: 'What do you want, Master? I can fulfil 3 your wishes!'");

	this.setSpecialIcon(SPECIAL_HEALTH, "images/icons/special_health.png");
	this.setSpecialIcon(SPECIAL_POWER, "images/icons/special_power.png");
	this.setSpecialIcon(SPECIAL_ITEM, "images/icons/special_item.png");
	this.setSpecialIcon(SPECIAL_TELEPORT, "images/icons/special_teleport.png");
	this.setSpecialIcon(SPECIAL_SUPER_POWER, "images/icons/special_superpower.png");
}
RoomGenie.prototype = Object.create( AbstractRoom.prototype );

RoomGenie.prototype.doSpecial = function(num)
{
	if( this.wishes <= 0 )
	{
		setRoom( new RoomEmpty() );
		alert("No more wishes, mortal!");
		return;
	}
	switch(num)
	{
		case SPECIAL_HEALTH:
			mainHero.setMaxHealth( mainHero.getMaxHealth() + getRandomInt(10, 40) );
			mainHero.setHealth( mainHero.getMaxHealth() );
			this.wishes--;
		break;
		case SPECIAL_POWER:
			mainHero.setPower( mainHero.getPower() + getRandomInt(1, 10) );
			this.wishes--;
		break;
		case SPECIAL_ITEM:
			for(var i = 0, j = getRandomInt(1, 4); i < j; i++ )
			{
				var item = getRandomInt(0, items.length);
				mainHero.giveItem( item );
			}
			this.wishes--;
		break;
		case SPECIAL_TELEPORT:
			mainHero.setRegion( new regions[ getRandomInt(0, regions.length) ]() );
			this.wishes--;
		break;
		case SPECIAL_SUPER_POWER:
			for(var i = 0, j = getRandomInt(1, 8); i < j; i++ )
			{
				var eff = new EffectTempRegen( getRandomInt(10, 100) );
				var eff2 = new EffectTempPower( getRandomInt(10, 100) );
				eff.applyEffect( mainHero );
				eff2.applyEffect( mainHero );
			}
			this.wishes--;
		break;
	}
	alert("You have " + this.wishes + " wishes left.");
}

//} 



// -------------------------------------
// ROOM TYPES
// -------------------------------------
/*
roomTypes.push( RoomEmpty );
roomTypes.push( RoomFight );
roomTypes.push( RoomAppletree );
roomTypes.push( RoomChest );
*/

pushRoomType( RoomEmpty, 30 );
pushRoomType( RoomFight, 10 );
pushRoomType( RoomTrader, 5 );
pushRoomType( RoomAppletree, 3 );
pushRoomType( RoomChest, 2 );
pushRoomType( RoomDoor, 2 );

// -------------------------------------
// HANDLER AND HELPER FUNCTIONS
// -------------------------------------

function pushRoomType( type, rarity )
{
	rarity = rarity || 1;
	for(var i = 0; i < rarity; ++i)
	{
		roomTypes.push( type );
	}
}

function genRandomRoom()
{
	if( mainHero.region != undefined )
	{
		var regionRoom = mainHero.region.genRoom();
		if(regionRoom != undefined )
		{
			return regionRoom;
		}
	}
	return new (roomTypes[ getRandomInt(0, roomTypes.length) ])();
}

function doNothingSpecial(num)
{

}

function handleItemDefault(item, index)
{
	var multipleUse = false; // if true, item will not be taken out of inventory after use
	
	switch(item)
	{
	case ITEM_APPLE:
		if( Math.random() > 0.7 )
		{
			alert("You took a bite of apple. It's pretty sweet!\nA small bug flies out of that apple! It transforms into sorceress, who says \"You are not Snow White!\" and throws a fireball to you and then disappears.");
			mainHero.setHealth( mainHero.getHealth() - 5 );
		} else
		{
			mainHero.setHealth( mainHero.getHealth() + 5 );
		}
	break;
	case ITEM_MEAT:
		mainHero.setHealth( mainHero.getHealth() + 10 );
	break;
	case ITEM_BREAD:
		mainHero.setHealth( mainHero.getHealth() + 7 );
	break;
	case ITEM_CAKE:
		mainHero.setHealth( mainHero.getHealth() + 10 );
		multipleUse = true;
		if(Math.random() < 0.5)
		{
			multipleUse = false;
			alert("Cake ended.")
		}
	break;
	case ITEM_GOLDEN_APPLE:
		var bonus = getRandomInt(1, 6);
		alert("You ate a golden apple and felt the power of the Universe of Randomnia!\n\nYou get +" + bonus + " points of Willpower!");
		mainHero.setPower( mainHero.getPower() + bonus );
	break;
	case ITEM_DOOR_KEY:
		multipleUse = true;
	break;
	case ITEM_POTION_RED:
	case ITEM_POTION_GREEN:
	case ITEM_POTION_BLUE:
	case ITEM_POTION_YELLOW:
	case ITEM_POTION_PINK:
		if( mainHero.potionEffects[item] == undefined )
		{
			var e = effects[ getRandomInt(0, effects.length) ];
			mainHero.potionEffects[item] = e;
			items[item].descr = items[item].descr.replace( UNKNOWN_EFFECT, "<div class='infoPotionEffect'>Potion of " + e.prototype.effectName + "</div>" );
			mainHero.updateData();
		}
		(new mainHero.potionEffects[item]( getRandomInt(3, 20) )).applyEffect( mainHero );
	break;
	case ITEM_POTION_RAINBOW:
		(new effects[ getRandomInt(0, effects.length) ]( getRandomInt(7, 30) ) ).applyEffect( mainHero );
	break;
	
	case ITEM_WHITE_FLAG:
		multipleUse = true;
		alert("You waved a flag and nothing happens.");
	break;
	case ITEM_PORTABLE_DOOR:
		setRoom( new RoomDoor() );
	break;
	case ITEM_WISH_GOGGLES:
		multipleUse = true;
		alert("Fancy goggles!");
	break;
	case ITEM_GENIE_LAMP:
		setRoom( new RoomGenie() );
	break;
	}
	
	if(!multipleUse)
	{
		mainHero.removeItemAt(index);
	}
}

})();