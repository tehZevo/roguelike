var Component = require.main.require("./ecs/Component.js");

/** hits stuff */
module.exports = class DamageComponent extends Component
{
  constructor()
  {
    super();

    this.require(PhysicsComponent);

    this.source = null;
    this.damage = 1;
    this.isMagical = false; //true for magic type damage
    this.damagesMana = false; //true for damage to mana

    this.targetType = 0; //0 = enemies, 1 = player, 2 = both
  }

  setSource(entity)
  {
    this.source = entity;
  }

  /** 0 = enemies, 1 = player, 2 = both */
  setTargetType(targetType)
  {
    this.targetType = targetType;
  }

  setDamage(damage)
  {
    this.damage = damage;

    return this;
  }

  setIsMagical(isMagical)
  {
    this.isMagical = isMagical;
  }

  setDamagesMana(damagesMana)
  {
    this.damagesMana = damagesMana;
  }

  onHitEntity(other)
  {
    var entity = this.getEntity();
    var world = entity.getComponent(BaseComponent).getWorld();

    var ocPlayer = other.getComponent(PlayerComponent);
    var ocEnemy = other.getComponent(EnemyComponent);
    var ocStats = other.getComponent(StatsComponent); //hurtbox class? (that way we can set invuln state, etc)

    var hit = false;

    if(ocPlayer != null && this.targetType == 1)
    {
      hit = true;
    }

    if(ocEnemy != null && this.targetType == 0)
    {
      hit = true;
    }

    if(hit)
    {
      ocStats.hit(this.damage, this.source, this.isMagical, this.damagesMana); //do the hit

      //call onDamageDone
      for(var key in entity.components)
      {
        var c = entity.components[key];

        if(c.onDamageDone != null)
        {
          c.onDamageDone(other);
        }
      }
    }
  }
}

var P = "./components/";
var PhysicsComponent = require.main.require(P + "PhysicsComponent.js");
var PlayerComponent = require.main.require(P + "PlayerComponent.js");
var StatsComponent = require.main.require(P + "StatsComponent.js");
var BaseComponent = require.main.require(P + "BaseComponent.js");
var EnemyComponent = require.main.require(P + "EnemyComponent.js");
