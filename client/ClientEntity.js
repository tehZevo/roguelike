/** client entity representation, position, sprite; that's pretty much it */
class ClientEntity
{
  constructor(client)
  {
    this.client = client;
    this.game = this.client.game;

    this.sprite = this.game.add.sprite();
    this.sprite.anchor.x = 0.5; //center sprite origin
    this.sprite.anchor.y = 0.5;
  }

  getSprite()
  {
    return this.sprite;
  }

  setImage(imageName)
  {
    //set image if not equal
    if(this.sprite.key != imageName)
    {
      this.sprite.loadTexture(imageName);

      console.log("changed image to: " + this.sprite.key);
    }
  }

  /** TODO: client side interp */
  update()
  {
    //TODO
  }

  onDelete()
  {
    if(this.sprite != null)
    {
      this.sprite.destroy();
    }
  }
}
