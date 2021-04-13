import { useCallback, useEffect, useRef } from "react";
import "./App.css";
import { CubeController } from "./libs/cube-controller";
import { useCubes } from "./libs/cube-manager";

function App() {
  const { cubes, scan } = useCubes();
  const gameRef = useRef<CubeController>();

  const onClickConnect = useCallback(() => scan(), [scan]);

  useEffect(() => {
    if (gameRef.current === undefined) {
      gameRef.current = new CubeController();
      gameRef.current.start();
    }

    return () => {
      gameRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    gameRef.current?.setCubes(cubes);
  }, [cubes]);

  return (
    <div className="container">
      <div>
        <div className="cube-counter">
          <span className="text-large">
            {cubes.length}
            <span className="text-medium cube-counter-label">cubes</span>
          </span>
        </div>
      </div>
      <button className="button text-medium" onClick={onClickConnect}>
        connect
      </button>
    </div>
  );
}

export default App;
