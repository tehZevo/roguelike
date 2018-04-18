module.exports = class HUD
{
  constructor(game)
  {
    this.game = game;

    this.health = []; //sprites
    this.mana = []; //sprites
  }

  setPlayer(player)
  {
    this.player = player;
  }

  update()
  {
    if(this.game == null || this.player == null)
    {
      return;
    }

    var playerInfo = {}; //just to get rid of old server statscomponent stuff

    var healthCount = Math.ceil((playerInfo.maxHealth || 0) / 4);
    var manaCount = Math.ceil((playerInfo.maxHealth || 0) / 4);

    while(this.health.length < healthCount)
    {
      var s = game.add.sprite(this.health.length * 8, 0, "health0");
      s.fixedToCamera = true;

      this.health.push(s);
    }
    while(this.health.length > healthCount)
    {
      this.health.pop(s);
    }

    for(var i = 0; i < this.health.length; i++)
    {
      var s = this.health[i];
      var num;
      if(playerInfo.health >= (i + 1) * 4)
      {
        num = 4;
      }
      else if(playerInfo.health < (i) * 4)
      {
        num = 0;
      }
      else
      {
        num = playerInfo.health % 4;
      }

      //var image = "health" + (mod == 0 ? (gtlt ? 4 : 0) : mod); //magic
      var image = "health" + num;//(gtlt ? 4 : mod);

      s.loadTexture(image);
    }

  }
}
