var monsterTypes = [];
var monsterTypesApple = [];

monsterTypes.push( MonsterGoblin );
monsterTypes.push( MonsterSkeleton );
monsterTypes.push( MonsterBug );
monsterTypes.push( MonsterShamanZago );

monsterTypesApple.push( MonsterDemonWorm );
monsterTypesApple.push( MonsterDrunkSkeleton );
monsterTypesApple.push( MonsterAppleZago );

function Monster(name, iconSrc, descr, health, damage)
{
	this.name = name;
	this.iconSrc = iconSrc;
	this.descr = descr;
	this.health = health;
	this.damage = damage;
}
Monster.prototype.attack = function(hero, log)
{
	var dmg = getRandomInt(0, this.damage);
	hero.setHealth( hero.getHealth() - dmg );
	
	return dmg;
}
Monster.prototype.beAttacked = function(dmg)
{
	this.health -= dmg;
	if(this.health < 0) this.health = 0;
}
Monster.prototype.isAlive = function()
{
	return this.health > 0;
}

//{ GOBLIN
function MonsterGoblin()
{
	Monster.apply(this, ["Goblin", "images/monsters/goblin.gif",
						"Goblin is small and thin creature with a club in a hand. It's dancing a strange battle dance, maybe trying to scare you.",
						30, 5]);
}
MonsterGoblin.prototype = Object.create( Monster.prototype );
//}

//{ SKELETON
function MonsterSkeleton()
{
	Monster.apply(this, ["Skeleton", "images/monsters/skeleton.gif",
						"You see a skeleton in front of you. She (it's obvious, that it's female skeleton) is walking towards you and waving a sword.",
						50, 10]);
}
MonsterSkeleton.prototype = Object.create( Monster.prototype );
//}

//{ BUG
function MonsterBug()
{
	Monster.apply(this, ["Bug", "images/monsters/bug.gif",
						"Big bug. Looks very similar to the fly, but much bigger.",
						25, 10]);
}
MonsterBug.prototype = Object.create( Monster.prototype );
//}

//{ DEMON WORM
function MonsterDemonWorm()
{
	Monster.apply(this, ["Demonic Worm", "images/monsters/demonWorm.gif",
						"Big and scary worm with demonic wings, forked tongue and luminous eyes, that change in colour. After looking at this creature, you understand, that you are afraid eating apples.",
						80, 10]);
}
MonsterDemonWorm.prototype = Object.create( Monster.prototype );
//}

//{ APPLE ZAGOGULIN

function MonsterAppleZago()
{
	Monster.apply(this, ["Apple Zagogulin", "images/monsters/zagoApple.gif",
						"Strange creature. You wouldn't even know, how is it called, but your hear the voice of Randomnia in your head: 'It's Zagogulin, you idiot!'<br>This one is apple Zagogulin, who lives in apples",
						50, 5]);
}
MonsterAppleZago.prototype = Object.create( Monster.prototype );
//}

//{ SHAMAN ZAGOGULIN
function MonsterShamanZago()
{
	Monster.apply(this, ["Shaman Zagogulin", "images/monsters/zagoShaman.gif",
						"Strange creature. You wouldn't even know, how is it called, but your hear the voice of Randomnia in your head: 'It's Zagogulin, you idiot!'<br>This one is shaman Zagogulin. Maybe, it can cast spells...",
						80, 15]);
}
MonsterShamanZago.prototype = Object.create( Monster.prototype );
MonsterShamanZago.prototype.attack = function(hero, log)
{
	var ret = Monster.prototype.attack.apply(this, arguments);
	if( Math.random() < 0.3 )
	{
		hero.setPower( hero.getPower() - 1 );
		log.extraMessage = "Zagogulin Shaman casts spell. You feel very uncomfortable and unconfident.";
	}
	
	return ret;
}
//}

//{ DRUNK SKELETON
function MonsterDrunkSkeleton()
{
	Monster.apply(this, ["Drunk skeleton", "images/monsters/drunkSkeleton.gif",
						"The skeleton holds beer in his hand. He seems very drunk. 'YOU SHALL NOT DRINK MY BEER' - he shouts and attacks you with his sword.",
						25, 10]);
}
MonsterDrunkSkeleton.prototype = Object.create( Monster.prototype );
//}

//{ GENIE
function MonsterGenie()
{
	Monster.apply(this, ["Genie", "images/monsters/genie.gif",
						"This genie doesn't look like he wants to fulfil your wishes...",
						200, 10]);
}
MonsterGenie.prototype = Object.create( Monster.prototype );
MonsterGenie.prototype.beAttacked = function(dmg)
{
	this.health -= dmg;
	if(this.health <= 0)
	{
		mainHero.giveItem(ITEM_GENIE_LAMP);
		this.health = 0;
	}
}
//}

//{ VAMPIRE
function MonsterVampire()
{
	Monster.apply(this, ["Vampire", "images/monsters/vampire.gif",
						"Just a bloodsucker. Aren't you surprised by a bloodsucker?",
						70, 10]);
}
MonsterVampire.prototype = Object.create( Monster.prototype );
MonsterVampire.prototype.attack = function(hero, log)
{
	var dmg = getRandomInt(0, this.damage);
	hero.setHealth( hero.getHealth() - dmg );
	
	if( Math.random() < 0.5 )
	{
		var reg = dmg / 2;
		log.extraMessage = "Vampire regenerated " + reg + " health.";
		this.health += reg;
	}
	
	return dmg;
}
//}
