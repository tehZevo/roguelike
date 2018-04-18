module.exports = class ServerEventHandler
{
  constructor(server, socket)
  {
    this.server = server;
    this.socket = socket;

    this.registerListeners();
  }

  registerListeners()
  {
    //default socket.io "disconnect"
    this.socket.on("disconnect", this.onDisconnect.bind(this));

    //other events
    this.socket.on("player_move", this.onPlayerMove.bind(this));
  }

  onDisconnect()
  {
    //grab player
    var p = this.server.findPlayerBySocket(this.socket);

    //delete entity (should send packet)
    this.server.getWorld().deleteEntity(p.getEntity());
  }

  onPlayerMove(data)
  {
    var p = this.server.findPlayerBySocket(this.socket).getEntity().getComponent(PlayerComponent);
    p.move(data.dx, data.dy);
  }
}

var P = "./components/";
var PlayerComponent = require.main.require(P + "PlayerComponent.js");
var NetworkComponent = require.main.require(P + "NetworkComponent.js");
