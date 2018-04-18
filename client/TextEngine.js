class TextEngine
{
  constructor(game)
  {
    this.game = game;
    //TODO
    this.textBox = this.createTextBox(0, 0, 8, 8);

    this.showTextBox(true);
  }

  showTextBox(show)
  {
    this.textBox.visible = show;
  }

  createTextBox(x1, y1, x2, y2)
  {
    var tb = this.game.add.group();
    this.game.stage.addChild(tb);

    for(var x = x1; x < x2; x++)
    {
      for(var y = y1; y < y2; y++)
      {
        var frame;

        if(y == y1)
        {
          if(x == x1) {frame = 0}
          else if(x < x2 - 1) {frame = 1}
          else {frame = 2}
        }
        else if(y < y2 - 1)
        {
          if(x == x1) {frame = 3}
          else if(x < x2 - 1) {frame = 4}
          else {frame = 5}
        }
        else
        {
          if(x == x1) {frame = 6}
          else if(x < x2 - 1) {frame = 7}
          else {frame = 8}
        }

        var s = this.game.add.sprite(x * 8, y * 8, "textbox", frame);
        //
        tb.add(s);
      }
    }

    return tb;
  }
}
