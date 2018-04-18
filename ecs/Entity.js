module.exports = class Entity
{
  constructor()
  {
    this.components = {};
  }

  /** pazz clazz, returns component */
  addComponent(Clazz)
  {
    //if component name (class name) is in components already, skip
    if(Clazz.name in this.components)
    {
      return this.components[Clazz];
    }

    var comp = new Clazz();

    for(var i = 0; i < comp.required.length; i++)
    {
      var C = comp.required[i];

      this.addComponent(C);
    }

    //add component after all dependencies
    comp.setEntity(this);
    this.components[Clazz.name] = comp;
    comp.init();

    return comp;
  }

  hasComponent(Clazz)
  {
    return Clazz.name in this.components;
  }

  /** pass class */
  getComponent(Clazz)
  {
    if(Clazz == null)
    {
      throw new Error();
    }
    return this.components[Clazz.name];
  }

  update()
  {
    for(var key in this.components)
    {
      var c = this.components[key];

      c.update(this);
    }
  }
}
