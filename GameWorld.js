module.exports = class GameWorld
{
  constructor(server, map, floor)
  {
    this.server = server; //server that holds this game world

    this.entities = [];
    this.map = {};
    this.nextNetID = 0;

    this.spawnX = 0.5; //.5 for center of block
    this.spawnY = 0.5;

    this.stairsX = 0.5; //.5 for center of block
    this.stairsY = 0.5;

    this.mapName = map;
    this.floor = floor;
    this.genMap(map, floor);

    //this should allow for tickrate change on the fly
    setTimeout(this.update.bind(this), 0);
  }

  getMapName()
  {
    return this.mapName;
  }

  getFloor()
  {
    return this.floor;
  }

  getServer()
  {
    return this.server;
  }

  /** simple approach to get networked ids TODO: use map of id: ent instead */
  getNextNetID()
  {
    var id = this.nextNetID;

    this.nextNetID++;

    return id;
  }

  genMap()
  {
    console.log("Generating map...")
    //for now, just generate map based on map name..
    if(this.mapName == "town")
    {
      this.setMap(MapBuilder.town());
    }
    else
    {
      this.setMap(MapBuilder.rotDungeon(40, 40));
    }
    console.log("Map created.")
  }

  setMap(map)
  {
    this.map = map;

    //update spawn position
    //spawn currently stored in world.map["spawnX"] etc ... just for now

    this.spawnX = (this.map["spawnX"] || 0) + 0.5;
    this.spawnY = (this.map["spawnY"] || 0) + 0.5;

    //create stairs entity TODO: this should be a part of a map loader or something..
    this.stairsX = (this.map["stairsX"] || 0) + 0.5;
    this.stairsY = (this.map["stairsY"] || 0) + 0.5;
    var stairsEnt = this.createEntity(StairsComponent);
    stairsEnt.getComponent(PhysicsComponent).setPos(this.stairsX, this.stairsY);
  }

  getMap()
  {
    return this.map;
  }

  update()
  {
    for(var i = 0; i < this.entities.length; i++)
    {
      var entity = this.entities[i];

      entity.update();
    }

    setTimeout(this.update.bind(this), 1000 / this.server.tickRate);
  }

  /** creates an entity with a BaseComponent */
  createEntity()
  {
    var entity = new Entity();

    var bc = entity.addComponent(BaseComponent).setWorld(this);

    //add components in args
    for(var i = 0; i < arguments.length; i++)
    {
      entity.addComponent(arguments[i]);
    }

    this.entities.push(entity);

    bc.doCreate();

    return entity;
  }

  getEntities()
  {
    return this.entities;
  }

  /** pass actual entity */
  deleteEntity(entity)
  {
    var index = this.entities.indexOf(entity);

    if(index != -1)
    {
      entity.getComponent(BaseComponent).doDelete();

      this.entities.splice(index, 1);
    }
  }
}

var Entity = require.main.require("./ecs/Entity.js");

var P = "./components/";
var PhysicsComponent = require.main.require(P + "PhysicsComponent.js");
var BaseComponent = require.main.require(P + "BaseComponent.js");
var StairsComponent = require.main.require(P + "StairsComponent.js");
var MapBuilder = require.main.require("./MapBuilder.js");
