module.exports = class Client
{
  constructor()
  {
    this.w = 20 * 1;
    this.h = 12 * 1;
    this.ppu = 32;


    this.game = new Phaser.Game(this.w * this.ppu, this.h * this.ppu, Phaser.AUTO, '',
    {
      preload: this.preload.bind(this),
      create: this.create.bind(this),
      update: this.update.bind(this),
      render: this.render.bind(this),
    });


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
  {
    this.game.load.image('player', IMG_PATH + '32_player.png');
    this.game.load.image('tile', IMG_PATH + '32_tile.png');
    this.game.load.image('block', IMG_PATH + '32_block.png');
    this.game.load.image('block_4x3', IMG_PATH + 'block_4x3.png');
    this.game.load.image('stairs', IMG_PATH + 'stairs_32.png');

    this.game.load.spritesheet('textbox', IMG_PATH + 'hud/textbox.png', 8, 8);

    //cp437 font
    this.game.load.spritesheet('font', IMG_PATH + 'hud/font.png', 8, 8);

    //health/mana
    for(var i = 0; i < 5; i++)
    {
      this.game.load.image("health" + i, IMG_PATH + "hud/health" + i + ".png");
      this.game.load.image("mana" + i, IMG_PATH + "hud/mana" + i + ".png");
    }

  }

  create()
  {
    //window events n stuff

    window.addEventListener("resize", function()
    {
        //scaleToWindow(this.game.canvas);
    });

    this.game.world.setBounds(-128 * this.ppu, -128 * this.ppu, 256 * this.ppu, 256 * this.ppu);
    this.game.forceSingleUpdate = false;
    //set scale mode
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.stage.disableVisibilityChange = true;
    console.log(this.game.isRunning)

    this.hud = new HUD(this.game);

    //this.textEngine = new TextEngine(this.game);

    //follow player
    //this.game.camera.follow(this.pSprite);

    //set hud player
    //this.hud.setPlayer(player);

    this.text = this.spriteString("Hello World!", 0, 0);

    //create map sprite group:

    this.map = this.game.add.group();

    this.connectToServer();

  }

  update()
  {
    //this is only called once if no sprites are loaded, and called ZERO times if any sprites are loaded
    console.log("hi")
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
  }

  render()
  {
    this.game.debug.cameraInfo(this.game.camera, 32, 32, "rgb(255, 255, 255)");
    //console.log(this.game.camera)
  }

  connectToServer()
  {
    console.log("Connecting to server...")

    this.socket = new Socket('http://localhost:4200');
    this.socketHandler = new ClientEventHandler(this, this.socket);
  }

  setCameraTarget(id)
  {
    var e = this.entities[id];

    //TODO: shouldnt we be determining this on the client (ie tell who the player is.. or something idk)
    if(e == null)
    {
      console.log("server told us to follow entity " + e + ", but that entity doesn't exist");

      return;
    }

    //this.game.camera.follow(e.getSprite()); //TODO: enable me
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
      //s.tint = 0x000000;
      s.tint = 0xffffff;
      s.fixedToCamera = true;
      arr.push(s);
    }

    return arr;
  }
}

var Socket = require("socket.io-client");

window.PIXI = require("phaser-ce/build/custom/pixi");
window.p2 = require("phaser-ce/build/custom/p2");
window.Phaser = require("phaser-ce/build/custom/phaser-split");

var HUD = require("./HUD.js");
var TextEngine = require("./TextEngine.js");
var PlayerMovePacket = require("./PlayerMovePacket.js");
var ClientEventHandler = require("./ClientEventHandler.js");

var IMG_PATH = "./assets/images/";
