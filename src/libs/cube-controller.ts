import { PositionedCube } from "./positioned-cube";

type Pos = {
  x: number;
  y: number;
  angle: number;
};

const calculateDistance = (pos1: Pos, pos2: Pos) => {
  const diffX = pos1.x - pos2.x;
  const diffY = pos1.y - pos2.y;
  return Math.sqrt(diffX * diffX + diffY * diffY);
};

const calculateSpeed = (pos1: Pos, pos2: Pos, isLargeTurn: boolean) => {
  const diffX = pos1.x - pos2.x;
  const diffY = pos1.y - pos2.y;
  const distance = Math.sqrt(diffX * diffX + diffY * diffY);
  if (distance < 50) {
    return { left: 0, right: 0 }; // stop
  }

  let relAngle = (Math.atan2(diffY, diffX) * 180) / Math.PI - pos2.angle;
  relAngle = relAngle % 360;
  if (relAngle < -180) {
    relAngle += 360;
  } else if (relAngle > 180) {
    relAngle -= 360;
  }

  if (isLargeTurn !== undefined && isLargeTurn) {
    relAngle /= 2;
  }

  let ratio = 1 - Math.abs(relAngle) / 90;
  let speed = 80;
  if (relAngle > 0) {
    return { left: speed, right: speed * ratio };
  } else {
    return { left: speed * ratio, right: speed };
  }
};

export class CubeController {
  public cubes: { [key: string]: PositionedCube } = {};
  public cubesOnMat: string[] = [];

  private timer?: NodeJS.Timeout;

  start = () => {
    this.timer = setInterval(this.loop, 50);
  };

  stop = () => {
    this.timer && clearInterval(this.timer);
  };

  setCubes = (cubes: PositionedCube[]) => {
    cubes.forEach((cube) => {
      if (this.cubes[cube.cube.id] === undefined) {
        this.cubes[cube.cube.id] = cube;
        cube.on("onMat", () => this.onMat(cube));
        cube.on("offMat", () => this.offMat(cube));
      }
    });
  };

  private loop = () => {
    if (this.cubesOnMat.length < 2) {
      return;
    }

    this.cubesOnMat.reduce((acc, cur) => {
      const accPos = this.cubes[acc].position;
      const curPos = this.cubes[cur].position;
      if (accPos === null || curPos === null) {
        return cur;
      }

      const speed = calculateSpeed(accPos, curPos, true);
      this.cubes[cur].cube.move({ ...speed, duration: 100 });
      return cur;
    }, this.cubesOnMat[this.cubesOnMat.length - 1]);
  };

  private onMat = (cube: PositionedCube) => {
    if (this.cubesOnMat.includes(cube.cube.id)) {
      return;
    }

    const nearest = this.cubesOnMat.reduce<{
      index: number;
      distance: number;
    }>(
      (acc, cur, index) => {
        const curPos = this.cubes[cur].position;
        if (curPos === null || cube.position === null) {
          return acc;
        }

        const distance = calculateDistance(curPos, cube.position);
        return acc.distance > distance
          ? { index: index, distance: distance }
          : acc;
      },
      { index: -1, distance: 5000 /* large enough */ }
    );
    this.cubesOnMat.splice(nearest.index + 1, 0, cube.cube.id);
  };

  private offMat = (cube: PositionedCube) => {
    this.cubesOnMat = this.cubesOnMat.filter((id) => {
      return id !== cube.cube.id;
    });
  };
}
