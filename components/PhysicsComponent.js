var Component = require.main.require("./ecs/Component.js");

/** events: onHitEntity(other), onHitWall() */
module.exports = class PhysicsComponent extends Component
{
  constructor()
  {
    super();

    this.pos = {};
    this.pos.x = 0;
    this.pos.y = 0;

    this.vel = {};
    this.vel.x = 0;
    this.vel.y = 0;

    this.force = {};
    this.force.x = 0;
    this.force.y = 0;

    this.size = 1;
  }

  /** size = radius */
  setSize(size)
  {
    this.size = size;
  }

  setPos(x, y)
  {
    this.pos.x = x;
    this.pos.y = y;
  }

  setVel(x, y)
  {
    this.vel.x = x;
    this.vel.y = y;
  }

  getPos()
  {
    return this.pos;
  }

  getVel()
  {
    return this.vel;
  }

  applyForce(fx, fy)
  {
    this.force.x += fx;
    this.force.y += fy;
  }

  /** calls all onHitEntity of other components */
  doCollide(other)
  {
    var e = this.getEntity();
  }

  update()
  {
    super.update();

    this.applyForce(-this.vel.x * 0.5, -this.vel.y * 0.5); //some friction...

    var oldX = this.pos.x;
    var oldY = this.pos.y;

    this.vel.x += this.force.x;
    this.vel.y += this.force.y;

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.force.x = 0;
    this.force.y = 0;

    var entity = this.getEntity();
    var cBase = entity.getComponent(BaseComponent);
    var cPhys = entity.getComponent(PhysicsComponent);
    var world = cBase.getWorld();
    var entities = world.getEntities();
    var map = world.getMap();

    //collide with map (point-aabb, nonswept)
    //TODO
    //x:
    var tx = Math.floor(this.pos.x);
    var ty = Math.floor(this.pos.y);

    var txOld = Math.floor(oldX);
    var tyOld = Math.floor(oldY);

    var dx = this.pos.x - oldX;
    var dy = this.pos.y - oldY;

    var tRight = map["" + (txOld + 1) + " " + tyOld] || 0;
    var tLeft = map["" + (txOld - 1) + " " + tyOld] || 0;
    var tUp = map["" + txOld + " " + (tyOld + 1)] || 0;
    var tDown = map["" + txOld + " " + (tyOld - 1)] || 0;

    var tOld = map["" + txOld + " " + tyOld] || 0;
    var tNew = map["" + tx + " " + ty] || 0;

    //if we moved into a block from the left
    if(dx > 0 && tRight != 0 && oldX < tx && this.pos.x + dx >= tx)
    {
      this.pos.x = tx - 0.01;
      this.vel.x = 0;
    }

    //if we moved into a block from the right
    if(dx < 0 && tLeft != 0 && oldX > tx + 1 && this.pos.x + dx <= tx + 1)
    {
      this.pos.x = tx + 1 + 0.01;
      this.vel.x = 0;
    }

    //update tile pos before checking y
    tx = Math.floor(this.pos.x);
    ty = Math.floor(this.pos.y);
    tNew = map["" + tx + " " + ty] || 0;

    //if we moved into a block from the bottom
    if(dy > 0 && tUp != 0 && oldY < ty && this.pos.y + dy >= ty)
    {
      this.pos.y = ty - 0.01;
      this.vel.y = 0;
    }

    //if we moved into a block from the top
    if(dy < 0 && tDown != 0 && oldY > ty + 1 && this.pos.y + dy <= ty + 1)
    {
      this.pos.y = ty + 1 + 0.01;
      this.vel.y = 0;
    }

    //collide with all other entities (not self; this means there will be up to 2 collision callbacks per collision)
    for(var i = 0; i < entities.length; i++)
    {
      var other = entities[i];
      var ocPhys = other.getComponent(PhysicsComponent);

      //skip self collision and nonphysical entities
      if(other == entity || ocPhys == null)
      {
        continue;
      }

      //collision check (size)
      if(dist2(cPhys.pos, ocPhys.pos) <= (this.size * this.size + ocPhys.size * ocPhys.size))
      {
        //call onHitEntity
        for(var key in entity.components)
        {
          var c = entity.components[key];

          if(c.onHitEntity != null)
          {
            c.onHitEntity(other);
          }
        }
      }

    }
  }
}

/** return distance squared between 2 objects with x/y properties */
function dist2(a, b)
{
  var dx = (a.x - b.x);
  var dy = (a.y - b.y);

  return dx * dx + dy * dy;
}

var P = "./components/";
var BaseComponent = require.main.require(P + "BaseComponent.js");
