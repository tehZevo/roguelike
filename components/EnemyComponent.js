var Component = require.main.require("./ecs/Component.js");

module.exports = class EnemyComponent extends Component
{
  constructor()
  {
    super();

    this.require(ActorComponent);
    this.require(DamageComponent);

    this.target = null;

    this.dx = 0;
    this.dy = 0;
  }

  init()
  {
    console.log("hi");
    var e = this.getEntity();
    var cDamage = e.getComponent(DamageComponent);

    cDamage.setDamage(1);
    cDamage.setTargetType(1);
    cDamage.setSource(e);
  }

  onHit(damage, source, isMagical, damagesMana)
  {
    this.target = source;
  }

  update()
  {
    super.update();

    var entity = this.getEntity();
    var cActor = entity.getComponent(ActorComponent);

    var speed = 10;

    thisPos = entity.getComponent(PhysicsComponent);

    //follow target
    if(this.target != null)
    {
      var tPos = target.getComponent(PhysicsComponent);

      //calculate diagonal angle to move at
      this.dx = Math.sign(tPos.x - thisPos.x) * speed; //TODO: trig or whatever to make it realistic
      this.dy = Math.sign(tPos.y - thisPos.y) * speed;
    }
    //roam around
    else if(Math.random() < 0.005)
    {
      //toggle between standing still and moving
      if(this.dx != 0 || this.dy != 0)
      {
        this.dx = 0;
        this.dy = 0;
      }
      else
      {
        this.dx = Math.floor(Math.random() * 3 - 1) * speed;
        this.dy = Math.floor(Math.random() * 3 - 1) * speed;
      }
    }

    cActor.act(new MoveAction(this.dx, this.dy));
  }
}

var P = "./components/";
var ActorComponent = require.main.require(P + "ActorComponent.js");
var DamageComponent = require.main.require(P + "DamageComponent.js");
var MoveAction = require.main.require("./actions/MoveAction.js");
