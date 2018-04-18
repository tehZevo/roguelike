var Component = require.main.require("./ecs/Component.js");

/** responsible for sending pos/vel updates to client */
module.exports = class NetworkComponent extends Component
{
  constructor()
  {
    super();

    /** networked entity id */
    this.netID = -1;
  }

  init()
  {
    //generate id
    this.netID = this.getEntity().getComponent(BaseComponent).getWorld().getNextNetID();
  }

  update()
  {
    var e = this.getEntity();
    var world = e.getComponent(BaseComponent).getWorld();

    //console.log("Sending entity_update");
    world.server.sockets.emit("entity_update", this.buildUpdatePacket()); //send entity update packet to all clients
  }

  onCreate()
  {
    console.log("Sending entity_create");

    var e = this.getEntity();
    var world = e.getComponent(BaseComponent).getWorld();
    var net = world.getServer().getNet();

    net.emit("entity_create", this.buildCreatePacket()); //create
    net.emit("entity_update", this.buildUpdatePacket()); //followed by update
  }

  onDelete()
  {
    console.log("Sending entity_delete");

    var e = this.getEntity();
    var world = e.getComponent(BaseComponent).getWorld();
    var net = world.getServer().getNet();

    net.emit("entity_delete", this.buildDeletePacket()); //delete
  }

  buildUpdatePacket()
  {
    var e = this.getEntity();
    var cPhys = e.getComponent(PhysicsComponent);

    var data = {};
    data.id = this.getID();
    data.x = cPhys.pos.x;
    data.y = cPhys.pos.y;
    data.vx = cPhys.vel.x;
    data.vy = cPhys.vel.y;

    return data;
  }

  buildCreatePacket()
  {
    var e = this.getEntity();
    var image = e.getComponent(RenderComponent).getImage();

    var data = {};
    data.id = this.getID();

    data.image = image;

    return data;
  }

  buildDeletePacket()
  {
    var e = this.getEntity();

    var data = {};
    data.id = this.getID();

    return data;
  }

  setID(id)
  {
    this.netID = id;
  }

  getID()
  {
    return this.netID;
  }
}

var P = "./components/";
var PhysicsComponent = require.main.require(P + "PhysicsComponent.js");
var BaseComponent = require.main.require(P + "BaseComponent.js");
var RenderComponent = require.main.require(P + "RenderComponent.js");
