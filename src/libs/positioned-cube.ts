import EventEmitter from "eventemitter3";
import { Cube } from "./cube";

export class PositionedCube {
  public cube: Cube;
  public position: { x: number; y: number; angle: number } | null;

  private eventEmitter: EventEmitter = new EventEmitter();

  constructor(cube: Cube) {
    this.cube = cube;
    this.position = null;

    this.cube.on("id:position-id", this.onMat);
    this.cube.on("id:position-id-missed", this.offMat);
    this.cube.on("id:standard-id", this.offMat);
    this.cube.on("id:standard-id-missed", this.offMat);
  }

  public on(key: string, func: (...args: any[]) => any): EventEmitter {
    return this.eventEmitter.on(key, func);
  }

  public off(key: string, func?: (...args: any[]) => any): EventEmitter {
    return this.eventEmitter.off(key, func);
  }

  public isOnMat = () => {
    return this.position !== null;
  };

  private onMat = (position: { x: number; y: number; angle: number }) => {
    if (this.position === null) {
      this.eventEmitter.emit("onMat");
    }
    this.position = position;
  };

  private offMat = () => {
    if (this.position !== null) {
      this.eventEmitter.emit("offMat");
    }
    this.position = null;
  };
}
