var Component = require.main.require("./ecs/Component.js");

module.exports = class PlayerComponent extends Component
{
  constructor()
  {
    super();

    this.require(ActorComponent);

    this.playerData = {};
  }

  init()
  {
    this.getEntity().getComponent(RenderComponent).setImage("player");
  }

  onHit(damage, source, isMagical, damagesMana)
  {
    var entity = this.getEntity();
    var cPhys = entity.getComponent(PhysicsComponent)

    //hit away
    var sourcePos = source.getComponent(PhysicsComponent).pos
    var dir = {};
    dir.x = Math.sign(cPhys.pos - sourcePos.x);
    dir.y = Math.sign(cPhys.pos - sourcePos.y);

    var hitSpeed = 500;
    //calc and set vel
    var vel = dir.clone().multiply(hitSpeed, hitSpeed);

    cPhys.vel.x = dir.x * hitSpeed
    cPhys.vel.y = dir.y * hitSpeed
  }

  setPlayerData(pd)
  {
    this.playerData = pd;
  }

  getPlayerData()
  {
    return this.playerData;
  }

  move(dx, dy)
  {
    var e = this.getEntity();
    var cActor = e.getComponent(ActorComponent);

    var speed = 0.05;

    if(dx != 0 || dy != 0)
    {
      cActor.act(new MoveAction(dx * speed, dy * speed));
    }
  }

  fireMissile()
  {
    //TODO: fire missile
  }

  update()
  {
    //TODO?
  }
}

var P = "./components/";
var ActorComponent = require.main.require(P + "ActorComponent.js");
var BaseComponent = require.main.require(P + "BaseComponent.js");
var PhysicsComponent = require.main.require(P + "PhysicsComponent.js");
var EnemyComponent = require.main.require(P + "EnemyComponent.js");
var MoveAction = require.main.require("./actions/MoveAction.js");
var MissileComponent = require.main.require(P + "MissileComponent.js");
var RenderComponent = require.main.require(P + "RenderComponent.js");
