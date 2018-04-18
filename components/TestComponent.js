var Component = require.main.require("./ecs/Component.js");

module.exports = class TestComponent extends Component
{
  update()
  {
    super.update();

    console.log("hello update!");
  }
}
