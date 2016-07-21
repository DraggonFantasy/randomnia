var items = [];

//{ ITEM IDs

var ITEM_APPLE 	= 0;
var ITEM_MEAT 	= 1;
var ITEM_BREAD	= 2;
var ITEM_CAKE	= 3;
var ITEM_GOLDEN_APPLE = 4;
var ITEM_DOOR_KEY = 5;

var ITEM_POTION_RED = 6;
var ITEM_POTION_GREEN = 7;
var ITEM_POTION_BLUE = 8;
var ITEM_POTION_YELLOW = 9;
var ITEM_POTION_PINK = 10;
var ITEM_POTION_RAINBOW = 11;

var ITEM_WHITE_FLAG = 12;
var ITEM_PORTABLE_DOOR = 13;
var ITEM_WISH_GOGGLES = 14;
var ITEM_GENIE_LAMP = 15;

//}

var UNKNOWN_EFFECT = "<div class='infoPotionEffect'>You don't know what effect does it do</div>";

(function()
{

function Item(name, descr, iconSrc)
{
	this.name = name;
	this.descr = descr;
	this.iconSrc = iconSrc;
}
Item.prototype.getName = function()
{
	return this.name;
}
Item.prototype.getDescription = function()
{
	return this.descr;
}
Item.prototype.getIcon = function()
{
	return this.iconSrc;
}

items[ITEM_APPLE]	= new Item("Apple",	"Big red apple", 		"images/items/apple.png");
items[ITEM_MEAT]	= new Item("Meat", 	"Ain't you a vegan?", 	"images/items/meat.png");
items[ITEM_BREAD]	= new Item("Bread", "A loaf of white bread","images/items/bread.png");
items[ITEM_CAKE]	= new Item("Cake", 	"Let's make a party!", 	"images/items/cake.png");
items[ITEM_GOLDEN_APPLE] =  new Item("Golden Apple", "A shiny golden apple, that seems to be magical.", "images/items/goldapple.png");
items[ITEM_DOOR_KEY] = new Item("Door key", "Big luminous key.", "images/items/doorKey.png");

items[ITEM_POTION_RED] = new Item("Red Potion",	 		 	 	"Bottle with a red potion." + UNKNOWN_EFFECT, 		"images/items/potionRed.png");
items[ITEM_POTION_GREEN] = new Item("Green Potion", 	 	"Bottle with a green potion." + UNKNOWN_EFFECT,   		"images/items/potionGreen.png");
items[ITEM_POTION_BLUE] = new Item("Blue Potion", 		 	 	"Bottle with a blue potion." + UNKNOWN_EFFECT, 		"images/items/potionBlue.png");
items[ITEM_POTION_YELLOW] = new Item("Yellow Potion", 	 	"Bottle with a yellow potion." + UNKNOWN_EFFECT,  		"images/items/potionYellow.png");
items[ITEM_POTION_PINK] = new Item("Pink Potion", 		 	 	"Bottle with a pink potion." + UNKNOWN_EFFECT,	 	"images/items/potionPink.png");
items[ITEM_POTION_RAINBOW] = new Item("Rainbow Potion", "Bottle with a rainbow colored potion.",					"images/items/potionRainbow.png");	

items[ITEM_WHITE_FLAG] = new Item("White flag", "'I give up!!!'", "images/items/whiteFlag.png");
items[ITEM_PORTABLE_DOOR] = new Item("Portable Door", "A small door, that fits in a pocket", "images/items/portableDoor.png");
items[ITEM_WISH_GOGGLES] = new Item("Goggles of wishful thinking", "In this goggles you see what you want to see", "images/items/goggles.png");

items[ITEM_GENIE_LAMP] = new Item("Genie lamp", "You have a Genie Lamp! Doesn't it sound cool?!", "images/items/genieLamp.png");
})();