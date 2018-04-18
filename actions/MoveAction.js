var Action = require.main.require("./actions/Action.js");

module.exports = class MoveAction extends Action
{
  constructor(xSpeed, ySpeed)
  {
    super();

    this.setSpeed(xSpeed, ySpeed);

    this.length = 1;
    this.interruptible = true;
  }

  setSpeed(xSpeed, ySpeed)
  {
    this.xSpeed = xSpeed || 0;
    this.ySpeed = ySpeed || 0;
  }

  update(entity)
  {
    super.update(entity);

    var cPhysics = entity.getComponent(PhysicsComponent);

    cPhysics.applyForce(this.xSpeed, this.ySpeed);
  }
}

var P = "./components/";
var PhysicsComponent = require.main.require(P + "PhysicsComponent.js");
