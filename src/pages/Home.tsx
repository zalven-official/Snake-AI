import React, { useState } from 'react';
import { getRandomInt } from '../helpers/randomizer';
import { distanceBetweenTwoPoints } from '../helpers/colliders';
import useFrameLoop from '../helpers/useFrameLoop';

const width = 58;
const height = 38;

function Home() {
  const [createBarrier, setCreateBarrier] = useState(false);
  // Game mode
  const [isDead, setIsDead] = useState(false);
  // Snake Properties
  const [snakeBody, setSnakeBody] = useState<Array<Array<number>>>([
    [width / 2, height / 2 - 2],
    [width / 2, height / 2 - 1],
    [width / 2, height / 2],
  ]);
  const [score, setScore] = useState(0);

  // Snake Food
  const [snakeFood, setSnakeFood] = useState<Array<number>>([
    getRandomInt(0, width - 1),
    getRandomInt(0, height - 1),
  ]);
  // Snake path
  const [snakePathFind, setSnakePathFind] = useState<Array<Array<number>>>();
  // Snake path
  const [snakePath, setSnakePath] = useState<Array<Array<number>>>();

  // A* Algorithm
  function pathFinder() {
    if (isDead) return '';
    const start = snakeBody[snakeBody.length - 1];
    const paths: Array<Array<number>> = [start];
    const allPath: Array<Array<number>> = [start];
    // Create env
    const env = [...Array(width)].map(() => Array(height));
    const envPath = [...Array(width)].map(() => Array(height));
    envPath[start[0]][start[1]] = 1;
    let foodFind = false;

    // Env Patterns for O(N) search
    const notAllowedPattern = -1;

    for (let i = 0; i < snakeBody.length; i += 1) {
      env[snakeBody[i][0]][snakeBody[i][1]] = notAllowedPattern;
    }
    while (paths.length > 0) {
      const x = paths[0][0];
      const y = paths[0][1];
      const cost = envPath[x][y];

      const pathDirection: Array<Array<number>> = [];

      // Up
      if (y > 0 && env[x][y - 1] !== notAllowedPattern) {
        const isUp = [x, y - 1];
        allPath.push(isUp);
        pathDirection.push(isUp);
        env[x][y - 1] = notAllowedPattern;
        envPath[x][y - 1] = cost + 1;
        if (x === snakeFood[0] && y - 1 === snakeFood[1]) {
          foodFind = true;
          break;
        }
      }

      //   Down
      if (y < height - 1 && env[x][y + 1] !== notAllowedPattern) {
        const isDown = [x, y + 1];
        allPath.push(isDown);
        pathDirection.push(isDown);
        env[x][y + 1] = notAllowedPattern;
        envPath[x][y + 1] = cost + 1;
        if (x === snakeFood[0] && y + 1 === snakeFood[1]) {
          foodFind = true;
          break;
        }
      }

      //  Left
      if (x > 0 && env[x - 1][y] !== notAllowedPattern) {
        const isLeft = [x - 1, y];
        allPath.push(isLeft);
        pathDirection.push(isLeft);
        env[x - 1][y] = notAllowedPattern;
        envPath[x - 1][y] = cost + 1;
        if (x - 1 === snakeFood[0] && y === snakeFood[1]) {
          foodFind = true;
          break;
        }
      }

      //  Right
      if (x < width - 1 && env[x + 1][y] !== notAllowedPattern) {
        const isRight = [x + 1, y];
        allPath.push(isRight);
        pathDirection.push(isRight);
        env[x + 1][y] = notAllowedPattern;
        envPath[x + 1][y] = cost + 1;
        if (x + 1 === snakeFood[0] && y === snakeFood[1]) {
          foodFind = true;
          break;
        }
      }
      pathDirection.sort((a, b) => {
        const aDist = distanceBetweenTwoPoints(
          a[0],
          a[1],
          snakeFood[0],
          snakeFood[1]
        );
        const bDist = distanceBetweenTwoPoints(
          b[0],
          b[1],
          snakeFood[0],
          snakeFood[1]
        );
        return bDist - aDist;
      });
      // A* Algorithm
      for (let i = 1; i < paths.length; i += 1) {
        const distPath = distanceBetweenTwoPoints(
          paths[i][0],
          paths[i][1],
          snakeFood[0],
          snakeFood[1]
        );
        if (pathDirection.length >= 1) {
          const distDirection = distanceBetweenTwoPoints(
            pathDirection[0][0],
            pathDirection[0][1],
            snakeFood[0],
            snakeFood[1]
          );
          if (distDirection <= distPath) {
            const direction = pathDirection.shift();
            if (direction) {
              paths.splice(i, 0, direction);
              i = 0;
            }
          }
        }
      }
      for (let i = 0; i < pathDirection.length; i += 1)
        paths.push(pathDirection[i]);

      paths.shift();

      setSnakePathFind(allPath);

      if (x === snakeFood[0] && y === snakeFood[1]) {
        foodFind = true;
        break;
      }
    }

    // Back track
    if (allPath.length >= 1 && foodFind) {
      const backtrackPath: Array<Array<number>> = [];
      let findEnd: Array<number> = [...snakeFood];
      for (
        let i = 0;
        i < allPath.length &&
        findEnd.length >= 1 &&
        envPath[findEnd[0]][findEnd[1]] > 1;
        i += 1
      ) {
        const x = findEnd[0];
        const y = findEnd[1];

        const pathDirection: Array<Array<number>> = [];
        // Up
        if (y > 0 && envPath[x][y - 1] < envPath[x][y]) {
          const isUp = [x, y - 1, 1];
          if (env[x][y - 1] === notAllowedPattern) pathDirection.push(isUp);
        }
        //   Down
        if (y < height - 1 && envPath[x][y + 1] < envPath[x][y]) {
          const isDown = [x, y + 1, 2];
          if (env[x][y + 1] === notAllowedPattern) pathDirection.push(isDown);
        }
        //  Left
        if (x > 0 && envPath[x - 1][y] < envPath[x][y]) {
          const isLeft = [x - 1, y, 3];
          if (env[x - 1][y] === notAllowedPattern) pathDirection.push(isLeft);
        }
        //  Right
        if (x < width - 1 && envPath[x + 1][y] < envPath[x][y]) {
          const isRight = [x + 1, y, 4];
          if (env[x + 1][y] === notAllowedPattern) pathDirection.push(isRight);
        }
        pathDirection.sort((a, b) => {
          const aDist = envPath[a[0]][a[1]];
          const bDist = envPath[b[0]][b[1]];
          return aDist - bDist;
        });
        if (pathDirection.length >= 1) {
          findEnd = [...pathDirection[0]];
          backtrackPath.push(pathDirection[0]);
          const z = [];
          for (let j = 0; j < pathDirection.length; j += 1) {
            z.push(envPath[pathDirection[j][0]][pathDirection[j][1]]);
          }
        } else {
          break;
        }
      }
      setSnakePath(backtrackPath);

      const lastInd = backtrackPath.length - 1;
      if (backtrackPath[lastInd][2] === 1) return 'D';
      if (backtrackPath[lastInd][2] === 2) return 'U';
      if (backtrackPath[lastInd][2] === 3) return 'R';
      if (backtrackPath[lastInd][2] === 4) return 'L';
    }

    return '';
  }

  // Movement
  function moveSnakeBody(snakeMove: string) {
    const snakeLength = snakeBody.length;
    const body = [...snakeBody];
    let move: Array<number> = [];

    // Move Up
    if (snakeMove === 'U')
      move = [snakeBody[snakeLength - 1][0], snakeBody[snakeLength - 1][1] - 1];
    // Move Down
    else if (snakeMove === 'D')
      move = [snakeBody[snakeLength - 1][0], snakeBody[snakeLength - 1][1] + 1];
    // Move Left
    else if (snakeMove === 'L')
      move = [snakeBody[snakeLength - 1][0] - 1, snakeBody[snakeLength - 1][1]];
    // Move Right
    else if (snakeMove === 'R')
      move = [snakeBody[snakeLength - 1][0] + 1, snakeBody[snakeLength - 1][1]];

    // Death
    if (move[0] < 0 || move[0] >= width || move[1] < 0 || move[1] >= height)
      setIsDead(true);
    for (let i = 0; i < body.length; i += 1) {
      if (body[i][0] === move[0] && body[i][1] === move[1]) {
        setIsDead(true);
        break;
      }
    }
    if (!isDead) {
      // Change food and eat food
      const eatFood = move[0] === snakeFood[0] && move[1] === snakeFood[1];
      if (eatFood) {
        for (let i = 0; i < 2000; i += 1) {
          const dropX = getRandomInt(0, width - 1);
          const dropY = getRandomInt(0, height - 1);
          let hasDroppedAvailable = true;
          for (let j = 0; j < body.length; j += 1) {
            const bodyDropX = body[j][0];
            const bodyDropY = body[j][1];
            if (dropX === bodyDropX && dropY === bodyDropY) {
              hasDroppedAvailable = false;
              break;
            }
          }
          if (hasDroppedAvailable) {
            setScore(score + 1);
            setSnakeFood([dropX, dropY]);
            break;
          }
        }
      }
      if (move.length === 2) body.push(move);
      if (snakeLength > 1 && !eatFood) body.shift();
      setSnakeBody(body);
    }
  }

  function handleCheckChange() {
    if (createBarrier) {
      setSnakeBody([
        [width / 2, height / 2 - 2],
        [width / 2, height / 2 - 1],
        [width / 2, height / 2],
      ]);
    }
    setCreateBarrier(!createBarrier);
  }

  function addBarrier(x: number, y: number) {
    if (createBarrier) {
      const result = [...snakeBody];
      result.unshift([x, y]);
      setSnakeBody(result);
    }
  }

  function gameMovement() {
    if (snakeFood) {
      const snakeMovement = pathFinder();
      moveSnakeBody(snakeMovement || 'D');
    }
  }

  useFrameLoop(() => {
    gameMovement();
  });

  return (
    <div className="mt-24 -z-10">
      {/* <div className="flex">
        <button
          className="btn btn-primary"
          type="button"
          onClick={gameMovement}
        >
          Move
        </button>
        <input
          type="checkbox"
          defaultChecked={createBarrier}
          onClick={() => handleCheckChange()}
          className="checkbox checkbox-secondary"
        />
      </div> */}
      {isDead && <p className="text-xl font-bold text-error"> Game over</p>}
      <p className="text-xl font-bold text-accent">
        <strong>Score : </strong>
        {score}
      </p>
      <div className="absolute flex">
        {Array.apply(0, Array(width)).map((x, i) => {
          const colKey = `${i}_col_snake_env`;
          return (
            <div key={colKey}>
              {Array.apply(0, Array(height)).map((y, j) => {
                const rowKey = `${j}_row_snake_env`;
                const snakeHead = snakeBody[snakeBody.length - 1];
                if (snakeHead[0] === i && snakeHead[1] === j) {
                  return (
                    <div
                      className="absolute w-5 h-5 bg-primary  shadow-sm rounded-sm"
                      key={rowKey}
                      style={{
                        left: `${i * 22 + 5}px`,
                        top: `${j * 22 + 5}px`,
                      }}
                    />
                  );
                }
                return (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                  <div
                    className="absolute w-5 h-5 bg-base-300 shadow-sm rounded-sm "
                    style={{
                      left: `${i * 22 + 5}px`,
                      top: `${j * 22 + 5}px`,
                    }}
                    key={rowKey}
                    onMouseDown={() => addBarrier(i, j)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="absolute flex">
        {snakePathFind?.map((y, i) => {
          const snakeKey = `${i}_snake_path_find`;
          return (
            <div
              className="absolute w-5 h-5 bg-base-100 border border-secondary opacity-40 shadow-sm rounded-sm snake-path-find"
              key={snakeKey}
              style={{
                left: `${y[0] * 22 + 5}px`,
                top: `${y[1] * 22 + 5}px`,
              }}
            />
          );
        })}
      </div>
      <div className="absolute flex">
        {snakePath?.map((y, i) => {
          const snakeKey = `${i}_snake_path_`;
          return (
            <div key={snakeKey}>
              <div
                className="absolute w-5 h-5 bg-base-100 border-2 border-primary opacity-60 shadow-sm rounded-sm"
                style={{
                  left: `${y[0] * 22 + 5}px`,
                  top: `${y[1] * 22 + 5}px`,
                }}
              />
              <div
                className="absolute w-5 h-5 bg-primary opacity-20 shadow-sm rounded-sm"
                style={{
                  left: `${y[0] * 22 + 5}px`,
                  top: `${y[1] * 22 + 5}px`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="absolute flex">
        <div
          className="absolute w-5 h-5 bg-accent rounded-3xl"
          style={{
            left: `${snakeFood[0] * 22 + 5}px`,
            top: `${snakeFood[1] * 22 + 5}px`,
          }}
        />
      </div>
      <div className="absolute flex">
        {snakeBody?.map((y, i) => {
          const snakeKey = `${i}_snake_body`;
          if (snakeBody.length - 1 === i) {
            return (
              <div
                className="absolute w-5 h-5 bg-primary  shadow-sm rounded-sm"
                key={snakeKey}
                style={{
                  left: `${y[0] * 22 + 5}px`,
                  top: `${y[1] * 22 + 5}px`,
                }}
              />
            );
          }
          return (
            <div
              key={snakeKey}
              className="absolute w-5 h-5 bg-secondary shadow-sm rounded-sm"
              style={{
                left: `${y[0] * 22 + 5}px`,
                top: `${y[1] * 22 + 5}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

Home.propTypes = {};

export default Home;
