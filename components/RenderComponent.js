var Component = require.main.require("./ecs/Component.js");

/** just for network component to transmit data */
module.exports = class RenderComponent extends Component
{
  constructor()
  {
    super();

    this.image = "";
  }

  setImage(image)
  {
    this.image = image;
  }

  getImage()
  {
    return this.image;
  }
}
