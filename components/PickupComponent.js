var Component = require.main.require("./ecs/Component.js");

module.exports = class PickupComponent extends Component
{
  constructor()
  {
    super();

    this.require(PhysicsComponent);
    this.require(RenderComponent);
  }

  onHitEntity(other)
  {
    var ocPlayer = other.getComponent(PlayerComponent);
    var world = this.getEntity().getComponent(BaseComponent).getWorld();

    //only hit players
    if(ocPlayer == null)
    {
      return;
    }

    var e = this.getEntity();

    for(var key in e.components)
    {
      var c = e.components[key];

      if(c.onPickup != null)
      {
        c.onPickup(other);
      }
    }

    //remove entity
    world.deleteEntity(this.getEntity());
  }
}

var P = "./components/";
var PhysicsComponent = require.main.require(P + "PhysicsComponent.js");
var RenderComponent = require.main.require(P + "RenderComponent.js");
var PlayerComponent = require.main.require(P + "PlayerComponent.js");
var BaseComponent = require.main.require(P + "BaseComponent.js");
