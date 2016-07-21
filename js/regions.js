
var regions = [];

regions.push( RegionChest );
regions.push( RegionGraveyard );

//{ ABSTRACT REGION
function AbstractRegion(name, roomBack, backColor, foreColor)
{
	this.name = name;
	this.roomBack = roomBack;
	this.backColor = backColor;
	this.foreColor = foreColor;
}
AbstractRegion.prototype.genRoom = function()
{
}
//}

//{ CHEST REGION
function RegionChest()
{
	AbstractRegion.apply(this, ["El Dorado", "images/room/back_treasure.png", "#FFFF73", "#000"]);
}
RegionChest.prototype = Object.create( AbstractRegion.prototype );
RegionChest.prototype.genRoom = function()
{
	if( Math.random() < 0.5 )
	{
		return (new RoomChest());
	}
	if( Math.random() < 0.3 )
	{
		var rm = new RoomFight();
		rm.setMonster( new MonsterGenie() );
		return rm;
	}
	if( Math.random() < 0.2 )
	{
		mainHero.setRegion( undefined );
	}
	return undefined;
}
//}

//{ GRAVEYARD REGION
function RegionGraveyard()
{
	AbstractRegion.apply(this, ["Graveyard", "images/room/back_graveyard.png", "#000000", "#FF2626"]);
}
RegionGraveyard.prototype = Object.create( AbstractRegion.prototype );
RegionGraveyard.prototype.graveyardMonsters = [ MonsterSkeleton, MonsterVampire ];
RegionGraveyard.prototype.genRoom = function()
{
	if( Math.random() < 0.7 )
	{
		var p = RegionGraveyard.prototype;
		var r = new RoomFight();
		r.setMonster( (new p.graveyardMonsters[ getRandomInt(0, p.graveyardMonsters.length) ]()) );
		return r;
	}
	if( Math.random() < 0.05 )
	{
		mainHero.setRegion( undefined );
	}
	return undefined;
}
//}