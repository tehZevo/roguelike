class PlayerMovePacket
{
  constructor()
  {
    this.data = {};
  }

  fromDelta(dx, dy)
  {
    this.data.dx = dx;
    this.data.dy = dy;

    return this;
  }
}
