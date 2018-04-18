module.exports = class Component
{
  constructor()
  {
    this.required = [];

    this.entity = null;
  }

  /** pass class */
  require(Clazz)
  {
    if(this.required.includes(Clazz))
    {
      return;
    }

    this.required.push(Clazz);
  }

  setEntity(e)
  {
    this.entity = e;
  }

  getEntity()
  {
    return this.entity;
  }

  /** override me (called when component added) */
  init()
  {

  }

  update()
  {
    //do stuff with entity
  }
}
