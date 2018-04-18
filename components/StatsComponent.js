var Component = require.main.require("./ecs/Component.js");

/** health, mana, and isDead */
module.exports = class StatsComponent extends Component
{
  constructor()
  {
    super();

    this.maxHealth = 12;
    this.maxMana = 4;
    this.health = this.maxHealth;
    this.mana = this.maxMana;

    this.dead = false;
  }

  setMaxHealth(maxHealth, restore)
  {
    restore = restore == null ? true : restore;

    this.maxHealth = maxHealth;

    if(restore)
    {
      this.health = this.maxhealth;
    }
  }

  setMaxMana(maxMana, restore)
  {
    restore = restore == null ? true : restore;

    this.maxMana = maxMana;

    if(restore)
    {
      this.mana = this.maxMana;
    }
  }

  setHealth(health)
  {
    this.health = health;

    return this;
  }

  addHealth(health)
  {
    this.health += health;

    return this;
  }

  getHealth()
  {
    return this.health;
  }

  setMana(mana)
  {
    this.mana = mana;

    return this;
  }

  addMana(mana)
  {
    this.mana += mana;

    return this;
  }

  getMana()
  {
    return this.mana;
  }

  hit(damage, source, isMagical, damagesMana)
  {
    isMagical = isMagical == null ? false : isMagical;
    damagesMana = damagesMana == null ? false : damagesMana;

    if(damagesMana)
    {
      this.addMana(-damage);
    }
    else
    {
      this.addHealth(-damage);
    }

    var e = this.getEntity();

    for(var key in e.components)
    {
      var c = e.components[key];

      if(c.onHit != null)
      {
        c.onHit(damage, source, isMagical, damagesMana);
      }
    }

    //TODO: magical stuff
    //TODO: store invuln state in this class?
  }

  isDead()
  {
    return this.dead;
  }

  update()
  {
    super.update();

    this.health = Math.max(0, Math.min(this.health, this.maxHealth));
    this.mana = Math.max(0, Math.min(this.mana, this.maxMana));

    if(this.health <= 0)
    {
      this.dead = true;
    }

    //kys
    if(this.isDead())
    {
      console.log("dead");
      var world = this.getEntity().getComponent(BaseComponent).getWorld();
      world.deleteEntity(this.getEntity());
    }
  }
}

var P = "./components/";
var BaseComponent = require.main.require(P + "BaseComponent.js");
