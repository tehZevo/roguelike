module.exports = class Server
{
  constructor()
  {
    console.log("Server starting...");

    this.host = "localhost";
    this.port = 4200;
    this.tickRate = 100; //ticks / second

    this.express = express(); //create express app, http server, and socketio
    this.http = http.createServer(this.express);
    this.sockets = socketio(this.http); //"sockets" is the collective socketio server

    //create game world (town, floor 0)
    this.world = new GameWorld(this, "town", 0);
    this.startTime = +(new Date() / 1000);
    //list of connected players
    this.players = [];

    this.sockets.on('connection', this.onConnection.bind(this));

    this.http.listen(this.port);

    console.log("Server started");
  }

  getNet()
  {
    return this.sockets;
  }

  getPlayers()
  {
    return this.players;
  }

  getPlayerCount()
  {
    return this.players.length;
  }

  getWorldInfo()
  {
    var i = {};

    i.map = this.world.getMapName();
    i.floor = this.world.getFloor();

    return i;
  }

  getWorld()
  {
    return this.world;
  }

  /** finds a player given their client socket */
  findPlayerBySocket(socket)
  {
    for(var i = 0; i < this.players.length; i++)
    {
      var p = this.players[i];

      if(p.socket == socket)
      {
        return p;
      }
    }

    return null;
  }

  createPlayer(socket)
  {
    var p = new Player(this, socket);

    this.players.push(p);

    return p;
  }

  /** finds a player given their entity's network id */
  findPlayerByNetID(id)
  {
    for(var i = 0; i < this.players.length; i++)
    {
      var p = this.players[i];

      if(p.getEntity().getComponent(NetworkComponent).getID() == id)
      {
        return p;
      }
    }

    return null;
  }

  onConnection(socket)
  {
    //TODO: apparently we have to register events here...
    console.log("Client connected");

    console.log("Adding socket event handler for client...");
    //create an event handler for this connection
    new ServerEventHandler(this, socket);

    //send all entities so far: TODO: uhh... move to an "onconnection" function in networkcomponent?
    console.log("Sending entities to client...");
    for(var i = 0; i < this.world.entities.length; i++)
    {
      var e = this.world.entities[i];

      if(e.hasComponent(NetworkComponent))
      {
        var cNet = e.getComponent(NetworkComponent);

        socket.emit("entity_create", cNet.buildCreatePacket());
      }
    }

    //send map:
    console.log("Sending map to client...");
    socket.emit("map", this.world.getMap());

    //create player entity
    console.log("Creating player entity...");
    var p = this.createPlayer(socket);

    //tell the player who they are:
    console.log("Sending player identity packet...")
    socket.emit("identity", p.getEntity().getComponent(NetworkComponent).getID());

    console.log("Client initialization complete.")
  }
}

var socketio = require('socket.io');
var express = require('express');
var http = require('http');

var ServerEventHandler = require("./ServerEventHandler.js");
var GameWorld = require.main.require("./GameWorld.js");

var P = "./components/";
var NetworkComponent = require.main.require(P + "NetworkComponent.js");
var Player = require.main.require("./Player.js");
