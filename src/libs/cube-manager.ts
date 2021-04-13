import { useState } from "react";
import { Cube } from "./cube";
import { PositionedCube } from "./positioned-cube";

export const useCubes = () => {
  const [cubes, setCubes] = useState<PositionedCube[]>([]);

  const scan = async () => {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [Cube.SERVICE_UUID] }],
    });
    const cube = new Cube(device);
    await cube.connect();
    const pCube = new PositionedCube(cube);

    setCubes((cubes) => [...cubes, pCube]);
  };

  return { cubes, scan };
};
