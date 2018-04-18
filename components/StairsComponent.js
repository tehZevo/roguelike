var Component = require.main.require("./ecs/Component.js");

module.exports = class StairsComponent extends Component
{
  constructor()
  {
    super();

    this.require(PhysicsComponent);
    this.require(RenderComponent);
    this.require(NetworkComponent);
  }

  init()
  {
    this.getEntity().getComponent(RenderComponent).setImage("stairs");
  }

  onHitEntity(e)
  {
    var ocPlayer = e.getComponent(PlayerComponent);

    if(ocPlayer == null)
    {
      return;
    }

    var cBase = this.getEntity().getComponent(BaseComponent);

    //TODO: with an actual main/login server, we should send "move client to ________" to the server
    //but here, just call the function lol..
    var world = cBase.getWorld();
    var server = world.getServer();

    var map = "dungeon";
    var floor = 0;

    //if we're already in a dungeon, increase floor number by 1
    if(world.getMapName() == "dungeon")
    {
      floor = world.getFloor() + 1;
    }

    //TODO: this should really be in a callback from a request to the main server
    var socket = server.findPlayerByNetID(e.getComponent(NetworkComponent).getID()).getSocket(); //find player's socket in this instance
    //server.tellClientToMoveTo(socket, this.host, this.port, map, floor);

  }
}

var P = "./components/";
var PhysicsComponent = require.main.require(P + "PhysicsComponent.js");
var RenderComponent = require.main.require(P + "RenderComponent.js");
var NetworkComponent = require.main.require(P + "NetworkComponent.js");
var BaseComponent = require.main.require(P + "BaseComponent.js");
var PlayerComponent = require.main.require(P + "PlayerComponent.js");
