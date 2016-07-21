var Hero;
var achievementList = {};

{ // ACHIEVEMENTS

var ACH_UNLIMITED = 0;

function Achievement(name, max, descr)
{
	if(max === undefined) max = 1;
	
	this.name = name;
	this.descr = descr;
	this.max = max;
}

achievementList["monstersMet"] = new Achievement("Monsters met", ACH_UNLIMITED);
achievementList["monstersKilled"] = new Achievement("Monsters killed", ACH_UNLIMITED);
achievementList["differentMonstersMet"] = new Achievement("Monstrologist", monsterTypes.length, "Meet all common types of Randomnia monsters!");
achievementList["appleTree"] = new Achievement("Random Apple?", 1, "Find famous Apple Tree of Randomnia.");
achievementList["crawler"] = new Achievement("Dungeon Crawler", 100, "Go through 100 rooms.");
achievementList["zagoShaman"] = new Achievement("Magic is no more danger!", 1, "Kill Zagogulin Shaman.");

}

(function(){


Hero = function(dataBlockId, name, face)
{
	this.dataBlockId = dataBlockId;
	
	this.name = name;
	this.face = face;
	this.power = 10;
	this.coins = 0;
	this.maxHealth = 100;
	this.health = this.maxHealth;
	this.region = undefined;
	
	this.activeEffects = [];
	this.inventory = [];
	this.achievements = {};
	this.monsterTypesMet = {};
	this.initAchievements();
	
	this.potionEffects = [];
	
	this.prevDirection = undefined;
	this.prevRoom = undefined;
	
	for(var i = 0; i < 5; ++i)
	{
		this.giveItem( getRandomInt(0, items.length) );
	}
}

{ // GETTERS

Hero.prototype.getName = function()
{
	return this.name;
}

Hero.prototype.getPower = function()
{
	return this.power;
}

Hero.prototype.getRegion = function()
{
	return this.region;
}

Hero.prototype.getCoins = function()
{
	return this.coins;
}

Hero.prototype.getHealth = function()
{
	return this.health;
}

Hero.prototype.getMaxHealth = function()
{
	return this.maxHealth;
}

}
{ // SETTERS

Hero.prototype.setName = function(name)
{
	this.name = name;
	this.updateData();
}

Hero.prototype.setRegion = function(region)
{
	this.region = region;
	this.updateData();
}

Hero.prototype.setPower = function(power)
{
	this.power = Math.floor( power );
	if( this.power < 1 ) this.power = 1;
	this.updateData();
}

Hero.prototype.setCoins = function(coins)
{
	this.coins = Math.floor( coins );
	if( this.coins < 0 ) this.coins = 0;
	this.updateData();
}

Hero.prototype.setHealth = function(health)
{
	this.health = Math.floor( health );
	
	if( this.health <= 0 )
	{
		this.health = 0;
		var self = this;
		setTimeout(function()
		{
			endGame( GAME_END_DEATH );
			//alert("RIP, " + self.getName() + "...\nYou were a good warrior, Randomnia will remember you, hero..." );
			//location.reload();
		}, 1000);
	} else if( this.health > this.maxHealth )
	{
		this.health = this.maxHealth;
	}
	
	this.updateData();
}

Hero.prototype.setMaxHealth = function(maxHealth)
{
	this.maxHealth = Math.floor( maxHealth );
	this.updateData();
}

}
{ // INVENTORY MANIPULATIONS

Hero.prototype.getItemAt = function(index)
{
	return this.inventory[index];
}

Hero.prototype.setItemAt = function(index, item)
{
	this.inventory[index] = item;
	this.updateData();
}

Hero.prototype.removeItemAt = function(index)
{
	this.inventory.splice(index, 1);
	this.updateData();
}

Hero.prototype.giveItem = function(item)
{
	this.inventory.push(item);
	this.updateData();
}

Hero.prototype.countSimilarItems = function(item)
{
	var count = 0;
	for(var i = 0, j = this.inventory.length; i < j; ++i)
	{
		if( this.inventory[i] === item )
		{
			count++;
		}
	}
	return count;
}

Hero.prototype.hasItem = function(item)
{
	for(var i = 0, j = this.inventory.length; i < j; ++i)
	{
		if( this.inventory[i] === item )
		{
			return true;
		}
	}
	return false;
}



Hero.prototype.countAllItems = function()
{
	return this.inventory.length;
}

}
{ // ACHIEVEMENT SYSTEM

Hero.prototype.initAchievements = function()
{
	for(var prop in achievementList)
	{
		if( !achievementList.hasOwnProperty(prop) ) continue;
		this.achievements[ prop ] = 0;
	}
}

Hero.prototype.achieve = function(ach)
{
	if( this.achievements[ ach ] == undefined ) return;
	
	this.achievements[ ach ] ++;
	if( this.achievements[ ach ] === achievementList[ ach ].max )
	{
		var bonusId = getRandomInt(0, 2);
		var bonus = "";
		switch(bonusId)
		{
			case 0:
				var item = getRandomInt(0, items.length);
				mainHero.giveItem( item );
				bonus = items[ item ].name + " item";
			break;
			case 1:
				var power = getRandomInt(1, 4);
				mainHero.setPower( mainHero.getPower() + power );
				bonus = power + " points of Willpower";
			break;
		}
		alert("Congratulations!\nYou have completed the '" + achievementList[ach].name + "' achievement!\nYou get " + bonus + " as a bonus!");
	}
	if( achievementList[ ach ].max !== ACH_UNLIMITED && this.achievements[ ach ] > achievementList[ ach ].max)
	{
		this.achievements[ ach ] = achievementList[ ach ].max;
	}
	this.updateAchievements();
}

Hero.prototype.isAchieved = function(ach)
{
	return this.achievements[ ach ] >= achievementList[ ach ].max;
}

Hero.prototype.updateAchievements = function()
{
	var aList = document.getElementById("achievements");
	aList.innerHTML = "";
	
	for(var prop in this.achievements)
	{
		if( !this.achievements.hasOwnProperty(prop) ) continue;
		
		var achDiv = document.createElement('div');
		achDiv.className = "achievement";
		achDiv.innerHTML = achievementList[prop].name + ": ";
		
		var achStatusSpan = document.createElement('span');
		achStatusSpan.className = ( this.isAchieved(prop) ) ? "completed" : "notCompleted";
		achStatusSpan.innerHTML = this.achievements[prop];
		if( achievementList[prop].max !== ACH_UNLIMITED )
		{
			achStatusSpan.innerHTML += " / " + achievementList[prop].max;
		}
		
		achDiv.appendChild(achStatusSpan);
		
		if( achievementList[prop].descr !== undefined )
		{
			var achDescrDiv = document.createElement('div');
			achDescrDiv.className = "description";
			achDescrDiv.innerHTML = achievementList[prop].descr;
			achDiv.appendChild(achDescrDiv);
		}
		
		aList.appendChild(achDiv);
	}
}

}

Hero.prototype.pushTempEffect = function(effect)
{
	this.activeEffects.push(effect);
	this.updateData();
}

Hero.prototype.tempEffectsStep = function()
{
	for(var i = 0, l = this.activeEffects.length; i < l; ++i)
	{
		if( this.activeEffects[i] == undefined ) continue;
		this.activeEffects[i].duration--;
		if( this.activeEffects[i].duration <= 0 )
		{
			this.activeEffects[i].deapplyEffect(this);
			this.activeEffects.splice(i, 1);
		} else
		{
			this.activeEffects[i].step(this);
		}
	}
	this.updateData();
}

Hero.prototype.cacheDataBlocks = function()
{
	var dataBlockId = this.dataBlockId;
	if(dataBlockId == null) return;
	
	if(this.dataBlock === undefined)
	{
		this.dataBlock = document.getElementById(dataBlockId);
	}
	if(this.dataBlock == null) return;
	
	if(this.nameBlock === undefined)
	{
		this.nameBlock = this.dataBlock.getElementsByClassName("heroName")[0];
	}
	if(this.faceBlock === undefined)
	{
		this.faceBlock = this.dataBlock.getElementsByClassName("heroFace")[0];
	}
	if(this.coinsBlock === undefined)
	{
		this.coinsBlock = this.dataBlock.getElementsByClassName("heroCoins")[0];
	}
	if(this.regionBlock === undefined)
	{
		this.regionBlock = this.dataBlock.getElementsByClassName("heroRegion")[0];
	}
	if(this.willpowerBlock === undefined)
	{
		this.willpowerBlock = this.dataBlock.getElementsByClassName("heroWillpower")[0];
	}
	if(this.healthBlock === undefined)
	{
		this.healthBlock = this.dataBlock.getElementsByClassName("heroHealth")[0];
	}
	if(this.inventoryBlock === undefined)
	{
		this.inventoryBlock = this.dataBlock.getElementsByClassName("heroInventory")[0];
	}
	if(this.effectsBlock === undefined)
	{
		this.effectsBlock = this.dataBlock.getElementsByClassName("heroEffects")[0];
	}
	if(this.roomImageWrapBlock === undefined)
	{
		this.roomImageWrapBlock = document.getElementById("roomImageWrap");
	}
}

Hero.prototype.updateData = function()
{
	this.cacheDataBlocks();
	
	this.nameBlock.innerHTML = this.name;
	this.faceBlock.src = faces[ this.face ];
	this.coinsBlock.innerHTML = this.coins;
	
	if(this.region != undefined)
	{
		this.roomImageWrapBlock.style.background = "url(" + this.region.roomBack + ")";
		this.regionBlock.innerHTML = this.region.name;
		var style = this.regionBlock.style;
		style.color = this.region.foreColor;
		style.background = this.region.backColor;
		style.textShadow = "0 0 10px " + this.region.foreColor;
	} else
	{
		this.roomImageWrapBlock.style.background = "url(images/room/back.png)";
		this.regionBlock.innerHTML = "No specific region";
		var style = this.regionBlock.style;
		style.color = "yellow";
		style.background = "#AA5555";
		style.textShadow = "0 0 10px yellow";
	}
	
	this.willpowerBlock.innerHTML = this.power;
	this.healthBlock.innerHTML = this.health;
	this.healthBlock.style.width = (this.health / this.maxHealth * 100) + '%';
	
	while (this.inventoryBlock.firstChild) this.inventoryBlock.removeChild(this.inventoryBlock.firstChild);
	//this.inventoryBlock.innerHTML = "";
	for(var i = this.inventory.length - 1; i >= 0; --i)
	{
		var item = items[ this.inventory[i] ];
		
		var inventoryItem = document.createElement('div');
		inventoryItem.className = "inventoryItem";
		
		var itemIcon = document.createElement('img');
		itemIcon.src = item.getIcon();
		itemIcon.alt = item.getName();
		itemIcon.className = "icon";
		
		var itemDescription = document.createElement('div');
		itemDescription.className = "description";
		itemDescription.innerHTML = item.getDescription();
		
		inventoryItem.appendChild(itemIcon);
		inventoryItem.innerHTML += item.getName();
		inventoryItem.appendChild(itemDescription);
		inventoryItem.onclick = onItemUse( this.inventory[i], i );
		
		this.inventoryBlock.appendChild(inventoryItem);
	}
	
	while (this.effectsBlock.firstChild) this.effectsBlock.removeChild(this.effectsBlock.firstChild);
	
	this.effectsBlock.innerHTML = "";
	var dura = {};
	for(var i = 0; i < this.activeEffects.length; ++i)
	{
		var e = this.activeEffects[i];
		if( dura[ e.icon ] === undefined ) dura[ e.icon ] = 0;
		
		dura[ e.icon ] += e.duration;
		
	}
	for(var e in dura)
	{
		if( !dura.hasOwnProperty(e) ) continue;
		
		var icon = document.createElement('img');
		icon.src = e;
		this.effectsBlock.appendChild(icon);
		this.effectsBlock.innerHTML += dura[e] + "<br>";
	}
}

function onItemUse(item, index)
{
	return function()
	{
		itemUse(item, index);
	}
}

})();