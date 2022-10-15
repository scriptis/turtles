export class Region3 {
  protected constructor(
    public readonly x0: number,
    public readonly y0: number,
    public readonly z0: number,
    public readonly x1: number,
    public readonly y1: number,
    public readonly z1: number,
  ) {}

  public get length() {
    return this.x1 - this.x0;
  }

  public get width() {
    return this.z1 - this.z0;
  }

  public get height() {
    return this.y1 - this.y0;
  }

  public get volume() {
    return this.length * this.width * this.height;
  }
}
