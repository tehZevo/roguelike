MB = {};

module.exports = MB;

MB.town = function()
{
  var map = MB.square(-5, -5, 10, 10);

  map["stairsX"] = 2;
  map["stairsY"] = 2;

  return map;
}

MB.square = function(x, y, w, h)
{
  var map = MB.empty();

  for(var ty = 0; ty < h; ty++)
  {
    for(var tx = 0; tx < w; tx++)
    {
      if(tx == 0 || ty == 0 || tx == w - 1 || ty == h - 1)
      {
        map[xy2key(x + tx, y + ty)] = 1;
      }
      else
      {
        map[xy2key(x + tx, y + ty)] = 0;
      }
    }
  }

  return map;
}

MB.rotDungeon = function(w, h)
{
  //ROT.RNG.setSeed(1234);

  var map = {};

  var o = {};
  o.dugPercentage = 0.4

  var rotMap = new ROT.Map.Digger(w, h, o);

  rotMap.create(function(x, y, v)
  {
    map[xy2key(x, y)] = v;
  });


  var rooms = rotMap.getRooms();

  //spawn point
  map["spawnX"] = rooms[0].getCenter()[0];
  map["spawnY"] = rooms[0].getCenter()[1];

  //stairs location
  map["stairsX"] = rooms[rooms.length - 1].getCenter()[0];
  map["stairsY"] = rooms[rooms.length - 1].getCenter()[1];

  //TODO: fancy stuff goes here (rooms, doors, hallways)

  return map;
}

MB.squareRandom = function(x, y, w, h, chance)
{
  var map = MB.square(x, y, w, h);

  for(var ty = 0; ty < h; ty++)
  {
    for(var tx = 0; tx < w; tx++)
    {
      if(Math.random() < chance)
      {
        map[xy2key(x + tx, y + ty)] = 1;
      }
    }
  }

  return map;
}

MB.test = function()
{
  var map = MB.square(0, 0, 10, 10);

  map[xy2key(5, 2)] = 1;
  map[xy2key(7, 2)] = 1;
  map[xy2key(6, 3)] = 1;
  map[xy2key(5, 4)] = 1;
  map[xy2key(7, 4)] = 1;

  map[xy2key(9, 4)] = 0;

  return map;
}

MB.empty = function()
{
  return {};
}

function xy2key(x, y)
{
  return "" + x + " " + y;
}

var ROT = require("rot-js");
