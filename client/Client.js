module.exports = class Client
{
  constructor()
  {
    this.w = 20 * 1;
    this.h = 12 * 1;
    this.ppu = 32;

    this.game = new Phaser.Game(this.w * this.ppu, this.h * this.ppu, Phaser.WEBGL, 'roguelike');//, { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });

    this.player = null;
    this.playerData = {};
    this.map = null;
    this.entities = {}; //map to server
    this.textEngine = null;
    this.socket = null;

    this.hud = new HUD(this.game);
    this.text = [];
    this.t = 0; //for text testing
  }

  getSocket()
  {
    return this.socket;
  }

  preload()
  {/*
      this.game.world.setBounds(-128 * this.ppu, -128 * this.ppu, 256 * this.ppu, 256 * this.ppu);

      this.game.load.image('player', './images/32_player.png');
      this.game.load.image('tile', './images/32_tile.png');
      this.game.load.image('block', './images/32_block.png');
      this.game.load.image('block_4x3', './images/block_4x3.png');
      this.game.load.image('stairs', './images/stairs_32.png');


      this.game.load.spritesheet('textbox', './images/hud/textbox.png', 8, 8);

      //cp437 font
      this.game.load.spritesheet('font', './images/hud/font.png', 8, 8);

      //health/mana
      for(var i = 0; i < 5; i++)
      {
        this.game.load.image("health" + i, "./images/hud/health" + i + ".png");
        this.game.load.image("mana" + i, "./images/hud/mana" + i + ".png");
      }
      */
  }

  create()
  {
    /*
    //window events n stuff
    window.addEventListener("resize", function()
    {
        //scaleToWindow(this.game.canvas);
    });

    //set scale mode
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.hud = new HUD(this.game);
    //this.textEngine = new TextEngine(this.game);

    //follow player
    //this.game.camera.follow(this.pSprite);

    //set hud player
    //this.hud.setPlayer(player);

    this.text = this.spriteString("Hello World!", 32, 32);

    //create map sprite group:
    this.map = this.game.add.group();

    this.connectToMainServer();
    */
  }

  update()
  {
    /*
    this.handleInput();

    //update hud
    this.hud.update();

    this.t += 0.1;

    for(var i = 0; i < this.text.length; i++)
    {
      var c = this.text[i];

      var x = 32 + i * 8 + Math.cos(this.t + i / 8 * Math.PI * 2) * 4;
      var y = 32 + Math.sin(this.t + i / 8 * Math.PI * 2) * 4;

      //TODO: fix
      //c.cameraOffset.x = x;
      //c.cameraOffset.y = y;
    }
    */
  }

  render()
  {
    /*
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    */
  }

  connectToServer()
  {
    console.log("Connecting to server...")

    this.socket = new Socket('http://localhost');
    this.socketHandler = new ClientEventHandler(this, this.socket);
  }

  setCameraTarget(id)
  {
    var e = this.entities[id];

    if(e == null)
    {
      console.log("server told us to follow entity " + e + ", but that entity doesn't exist");

      return;
    }

    this.game.camera.follow(e.getSprite());
  }

  //client input
  handleInput()
  {
    var dx = 0;
    var dy = 0;

    var kb = this.game.input.keyboard;

    if(kb.isDown(Phaser.Keyboard.LEFT))
    {
      dx -= 1;
    }
    if(kb.isDown(Phaser.Keyboard.RIGHT))
    {
      dx += 1;
    }
    if(kb.isDown(Phaser.Keyboard.UP))
    {
      dy -= 1; //TODO: reverse?
    }
    if(kb.isDown(Phaser.Keyboard.DOWN))
    {
      dy += 1;
    }

    if(dx != 0 || dy != 0)
    {
      console.log("sending player_move");
      this.socket.emit("player_move", new PlayerMovePacket().fromDelta(dx, dy).data);
    }

    //shoot some missiles :)
    //TODO: this would be using a skill basically...
    if(kb.isDown(Phaser.Keyboard.SPACEBAR))
    {
      this.socket.emit("space");
    }
  }

  spriteString(str, x, y)
  {
    var arr = [];

    for(var i = 0; i < str.length; i++)
    {
      var s = this.game.add.sprite(x + i * 8, y, "font", str.charCodeAt(i));
      s.tint = 0x000000;
      s.fixedToCamera = true;
      arr.push(s);
    }

    return arr;
  }
}

var Socket = require("socket.io-client");

var HUD = require("./HUD.js");
var TextEngine = require("./TextEngine.js");
var PlayerMovePacket = require("./PlayerMovePacket.js");
var ClientEventHandler = require("./ClientEventHandler.js");
