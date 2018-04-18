var Component = require.main.require("./ecs/Component.js");

module.exports = class ActorComponent extends Component
{
  constructor()
  {
    super();

    this.require(PhysicsComponent);
    this.require(RenderComponent);
    this.require(NetworkComponent);
    this.require(StatsComponent);

    this.currentAction = null;
    this.nextAction = null;

    this.health = 8;
    this.mana = 8;
  }

  /** attempts to do action, if unable, schedules it to be the next action */
  act(action)
  {
    //do next action if no action was provided
    if(action == null && this.nextAction != null)
    {
      action = this.nextAction;
      this.nextAction = null;
    }

    if(this.currentAction == null || this.currentAction.isInterruptible())
    {
      this.currentAction = action;

      //TODO: finish?
      this.currentAction.start(this.getEntity());

      return true;
    }

    this.nextAction = action;

    return false;
  }

  getAction()
  {
    return this.currentAction;
  }

  update()
  {
    super.update();

    var entity = this.getEntity();

    if(this.currentAction != null)
    {
      this.currentAction.update(entity);

      if(this.currentAction.getRemainingLength() <= 0)
      {
        this.currentAction.finish(entity);
        this.currentAction = null;
      }
    }

    //do next action
    if(this.currentAction == null && this.nextAction != null)
    {
      this.act();
    }
  }
}

var P = "./components/";
var PhysicsComponent = require.main.require(P + "PhysicsComponent.js");
var RenderComponent = require.main.require(P + "RenderComponent.js");
var NetworkComponent = require.main.require(P + "NetworkComponent.js");
var StatsComponent = require.main.require(P + "StatsComponent.js");
