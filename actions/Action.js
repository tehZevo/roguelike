module.exports = class Action
{
  constructor()
  {
    this.interruptible = true;
    this.length = 0;
    this.remainingLength = 0;
  }

  isInterruptible()
  {
    return this.interruptible;
  }

  getLength()
  {
    return this.length;
  }

  getRemainingLength()
  {
    return this.remainingLength;
  }

  /** override me */
  start(entity)
  {
    this.remainingLength = this.length;
  }

  /** override me */
  update(entity)
  {
    this.remainingLength--;
  }

  /** override me */
  finish(entity)
  {

  }
}
