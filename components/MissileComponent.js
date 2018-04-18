var Component = require.main.require("./ecs/Component.js");

/** stuff that all entities need */
module.exports = class MissileComponent extends Component
{
  constructor()
  {
    super();

    this.require(DamageComponent);
    this.require(RenderComponent);

    this.target = null;
    this.speed = 250;
    this.dir = {};
    this.dir.x = 0;
    this.dir.y = 0;
  }

  //TODO: on create set damage of hitbox

  onDamageDone(other)
  {
    var entity = this.getEntity();

    entity.getComponent(BaseComponent).getWorld().deleteEntity(entity); //kys
  }

  onHitWall()
  {
    var entity = this.getEntity();

    entity.getComponent(BaseComponent).getWorld().deleteEntity(entity); //kys
  }

  setTarget(target)
  {
    this.target = target;
  }

  setSpeed(speed)
  {
    this.speed = 10;
  }

  setDirection(dir)
  {
    this.dir = dir;
  }

  update()
  {
    try
    {
      super.update();

      var entity = this.getEntity();
      var cPhys = entity.getComponent(PhysicsComponent);

      //follow
      if(this.target != null && !this.target.getComponent(StatsComponent).isDead())
      {
        var targetPos = this.target.getComponent(PhysicsComponent).pos;

        this.dir.x = Math.sign(targetPos.x - cPhys.pos.x);
        this.dir.y = Math.sign(targetPos.y - cPhys.pos.y);
      }

      //calc and set vel
      cPhys.vel.x = this.dir.x * this.speed;
      cPhys.vel.y = this.dir.y * this.speed;
    }
    catch(e)
    {
        throw(e);
    }
  }
}

var P = "./components/";
var DamageComponent = require.main.require(P + "DamageComponent.js");
var RenderComponent = require.main.require(P + "RenderComponent.js");
var PhysicsComponent = require.main.require(P + "PhysicsComponent.js");
var BaseComponent = require.main.require(P + "BaseComponent.js");
var StatsComponent = require.main.require(P + "StatsComponent.js");
