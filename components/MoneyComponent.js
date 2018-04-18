var Component = require.main.require("./ecs/Component.js");

module.exports = class MoneyComponent extends Component
{
  constructor()
  {
    super();

    this.require(PickupComponent);

    this.value = 1;
  }

  setValue(value)
  {
    this.value = value;
  }

  getValue()
  {
    return this.value;
  }

  onPickup(player)
  {
    var pd = player.getComponent(PlayerComponent).getPlayerData();

    pd.money = (pd.money || 0) + 1;

    console.log(pd.money);
  }
}

var P = "./components/";
var PickupComponent = require.main.require(P + "PickupComponent.js");
var PlayerComponent = require.main.require(P + "PlayerComponent.js");
