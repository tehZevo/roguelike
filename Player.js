module.exports = class Player
{
  constructor(server, socket)
  {
    this.server = server;
    this.socket = socket; //socket to the player's client

    var world = server.getWorld();

    this.playerData = {};

    //create player entity
    console.log("Creating player entity...");
    this.entity = world.createEntity(PlayerComponent);
    this.entity.getComponent(PlayerComponent).setPlayerData(this.playerData); //set player data
    this.entity.getComponent(RenderComponent).setImage("player"); //set player sprite image
    this.entity.getComponent(PhysicsComponent).setPos(world.spawnX, world.spawnY); //move player to spawn position
  }

  getSocket()
  {
    return this.socket;
  }

  getEntity()
  {
    return this.entity;
  }
}

var P = "./components/";
var PlayerComponent = require.main.require(P + "PlayerComponent.js");
var RenderComponent = require.main.require(P + "RenderComponent.js");
var PhysicsComponent = require.main.require(P + "PhysicsComponent.js");
