var Component = require.main.require("./ecs/Component.js");

/** stuff that all entities need */
module.exports = class BaseComponent extends Component
{
  constructor()
  {
    super();

    this.world = null; //gameworld
  }

  /** set me too */
  setWorld(world)
  {
    this.world = world;

    return this;
  }

  getWorld()
  {
    return this.world;
  }

  /** calls onDelete */
  doDelete()
  {
    var e = this.getEntity();

    for(var key in e.components)
    {
      var c = e.components[key];

      if(c.onDelete != null)
      {
        c.onDelete();
      }
    }
  }

  /** calls onCreate */
  doCreate()
  {
    var e = this.getEntity();

    for(var key in e.components)
    {
      var c = e.components[key];

      if(c.onCreate != null)
      {
        c.onCreate();
      }
    }
  }
}
