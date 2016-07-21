var DURATION_INSTANT = 0;

var effects = [];

effects.push( EffectHeal );
effects.push( EffectMaxHealth );
effects.push( EffectTempRegen );
effects.push( EffectTempPower );

effects.push( EffectPoison );
effects.push( EffectMaxPoison );

//{ ABSTRACT EFFECT
function AbstractEffect(duration, icon)
{
	this.initialDuration = duration;
	this.duration = duration;
	this.icon = icon;
}
AbstractEffect.prototype.applyEffect = function(hero)
{
	if( this.duration !== DURATION_INSTANT )
	{
		hero.pushTempEffect(this);
	}
}
AbstractEffect.prototype.step = function(hero)
{
}
AbstractEffect.prototype.deapplyEffect = function(hero)
{
}
//}

//{ INSTANT HEAL EFFECT
function EffectHeal()
{
	AbstractEffect.apply(this, [DURATION_INSTANT] );
}
EffectHeal.prototype = Object.create( AbstractEffect.prototype );
EffectHeal.prototype.effectName = "Instant heal";
EffectHeal.prototype.applyEffect = function(hero)
{
	hero.setHealth( hero.getHealth() + getRandomInt(5, 20) );
}
//}

//{ INSTANT MAX HEALTH EFFECT
function EffectMaxHealth()
{
	AbstractEffect.apply(this, [DURATION_INSTANT] );
}
EffectMaxHealth.prototype = Object.create( AbstractEffect.prototype );
EffectMaxHealth.prototype.effectName = "Bigger health"; 
EffectMaxHealth.prototype.applyEffect = function(hero)
{
	hero.setMaxHealth( hero.getMaxHealth() + getRandomInt(1, 20) );
}
//}

//{ REGENERATION EFFECT
function EffectTempRegen(duration)
{
	AbstractEffect.apply(this, [duration, "images/icons/effect_regen.png"]);
	this.effectPower = getRandomInt(1, 5);
}
EffectTempRegen.prototype = Object.create( AbstractEffect.prototype );

EffectTempRegen.prototype.effectName = "Regeneration";

EffectTempRegen.prototype.step = function(hero)
{
	hero.setHealth( hero.getHealth() + this.effectPower );
}
//}

//{ POISON EFFECT
function EffectPoison(duration)
{
	AbstractEffect.apply(this, [duration, "images/icons/effect_poison.png"]);
	this.effectPower = getRandomInt(1, 7);
}
EffectPoison.prototype = Object.create( AbstractEffect.prototype );

EffectPoison.prototype.effectName = "Poison";

EffectPoison.prototype.step = function(hero)
{
	hero.setHealth( hero.getHealth() - this.effectPower );
}
//}

//{ MAX HEALTH POISON EFFECT
function EffectMaxPoison(duration)
{
	AbstractEffect.apply(this, [duration, "images/icons/effect_max_poison.png"]);
	this.effectPower = getRandomInt(1, 30);
}
EffectMaxPoison.prototype = Object.create( AbstractEffect.prototype );

EffectMaxPoison.prototype.effectName = "Poison of bigger health";

EffectMaxPoison.prototype.applyEffect = function(hero)
{
	if( this.duration !== DURATION_INSTANT )
	{
		hero.pushTempEffect(this);
	}
	this.prevHealth = hero.getMaxHealth();
	var t = hero.getHealth() / this.prevHealth;
	hero.setMaxHealth( hero.getMaxHealth() - this.effectPower );
	hero.setHealth( t * hero.getMaxHealth() );
}

EffectMaxPoison.prototype.deapplyEffect = function(hero)
{
	hero.setMaxHealth( this.prevHealth );
}
//}

//{ TEMPORARY POWER EFFECT
function EffectTempPower(duration)
{
	AbstractEffect.apply(this, [duration, "images/icons/effect_power.png"]);
	this.effectPower = getRandomInt(1, 10);
}
EffectTempPower.prototype = Object.create( AbstractEffect.prototype );

EffectTempPower.prototype.effectName = "Temporary intelligence";

EffectTempPower.prototype.applyEffect = function(hero)
{
	if( this.duration !== DURATION_INSTANT )
	{
		hero.pushTempEffect(this);
	}
	hero.setPower( hero.getPower() + this.effectPower );
}

EffectTempPower.prototype.deapplyEffect = function(hero)
{
	hero.setPower( hero.getPower() - this.effectPower );
}
//}