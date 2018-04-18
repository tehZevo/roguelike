module.exports = class ClientEventHandler
{
  constructor(client, socket)
  {
    this.client = client;
    this.socket = socket;

    this.initListeners();
  }

  initListeners()
  {
    //socket.io default events
    this.socket.on("connect", this.onConnect.bind(this));
    this.socket.on("disconnect", this.onDisconnect.bind(this));

    this.socket.on("entity_create", this.onEntityCreate.bind(this));
    this.socket.on("entity_update", this.onEntityUpdate.bind(this));
    this.socket.on("entity_delete", this.onEntityDelete.bind(this));
    this.socket.on("map", this.onMap.bind(this));
    this.socket.on("identity", this.onIdentity.bind(this));;
  }

  onConnect()
  {
    console.log("Connected to server");
  }

  onDisconnect()
  {
    console.log("Disconnected from server");
  }

  onIdentity(data)
  {
    this.client.setCameraTarget(data);
  }

  onMap(data)
  {
    this.client.map.removeAll(true); //remove all current map sprites

    var keys = Object.keys(data);

    for(var i = 0; i < keys.length; i++)
    {
      var key = keys[i];
      var xy;

      try
      {
        xy = key.split(/\s+/g).map(e => (parseInt(e)));
      }
      catch(e)
      {
        console.log("couldn't parse key '" + key + "'");

        continue;
      }

      var tile = data[key];

      var tileStr = tile == 0 ? "tile" : tile == 1 ? "block" : "";

      //add tile to map
      var s = this.client.map.create(xy[0] * this.client.ppu, xy[1] * this.client.ppu, tileStr);
      //s.autoCull = true;
    }

    console.log("loaded map data from server");
    console.log(data)
  }

  onEntityCreate(data)
  {
    console.log("entity_create: " + JSON.stringify(data));

    //create entity
    var es = this.client.entities;

    if(data.id in es)
    {
      console.log("entity " + data.id + " already exists on client");

      return;
    }

    var e = new ClientEntity(this.client);
    e.setImage(data.image)

    es[data.id] = e;
  }

  onEntityUpdate(data)
  {
    //console.log("entity_update: " + JSON.stringify(data));
    var es = this.client.entities;

    if(!(data.id in es))
    {
      console.log("entity " + data.id + " doesn't exist");

      return;
    }

    var e = es[data.id];

    e.sprite.x = data.x * this.client.ppu;
    e.sprite.y = data.y * this.client.ppu;
  }

  onEntityDelete(data)
  {
    var es = this.client.entities;

    if(!(data.id in es))
    {
      console.log("entity " + data.id + " doesn't exist");

      return;
    }

    var e = es[data.id];
    e.onDelete();
  }
}

var ClientEntity = require("./ClientEntity.js");
