import React, { useEffect, useState } from 'react';
import { getRandomInt } from '../helpers/randomizer';
import { distanceBetweenTwoPoints } from '../helpers/colliders';
import useFrameLoop from '../helpers/useFrameLoop';

const width = 58;
const height = 38;

function isMoveAllowed(snakeMove: string, movement: string) {
  if (snakeMove === 'D') return movement !== 'U';
  if (snakeMove === 'U') return movement !== 'D';
  if (snakeMove === 'R') return movement !== 'L';
  if (snakeMove === 'L') return movement !== 'R';
  return false;
}

function pathFinder(
  barrier: Array<Array<number>>,
  start: Array<number>,
  end: Array<number>
) {
  return [
    [width / 2 - 2, height / 2 - 2],
    [width / 2 - 2, height / 2 - 1],
    [width / 2 - 2, height / 2],
  ];
}

function Home() {
  // Snake Properties
  const [snakeBody, setSnakeBody] = useState<Array<Array<number>>>([
    [width / 2, height / 2 - 2],
    [width / 2, height / 2 - 1],
    [width / 2, height / 2],
  ]);
  // Snake Movement (U: Up, D: Down, L: Left, R: Right)
  const [snakeMove, setSnakeMove] = useState<string>('D');

  // Snake Food
  const [snakeFood, setSnakeFood] = useState<Array<number>>([
    getRandomInt(0, width - 1),
    getRandomInt(0, height - 1),
  ]);
  // Snake path
  const [snakePathFind, setSnakePathFind] = useState<Array<Array<number>>>();
  // Snake path
  const [snakePath, setSnakePath] = useState<Array<Array<number>>>();

  // Change movement of snake
  function changeMovement(movement: string) {
    if (isMoveAllowed(snakeMove, movement)) setSnakeMove(movement);
  }
  // Movement
  function moveSnakeBody() {
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
      console.log(move);

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
          setSnakeFood([dropX, dropY]);
          break;
        }
      }
    }

    // Move Head
    if (move.length === 2) body.push(move);
    // Remove Tail
    if (snakeLength > 1 && !eatFood) body.shift();

    setSnakeBody(body);
  }

  useEffect(() => {
    const start = snakeBody[snakeBody.length - 1];
    const paths: Array<Array<number>> = [start];
    const allPath: Array<Array<number>> = [start];
    // Create env
    const env = [...Array(width)].map(() => Array(height));

    // Env Patterns for O(N) search
    const notAllowedPattern = -1;

    for (let i = 0; i < snakeBody.length; i += 1) {
      env[snakeBody[i][0]][snakeBody[i][1]] = notAllowedPattern;
    }
    while (paths.length > 0) {
      const x = paths[0][0];
      const y = paths[0][1];

      const pathDirection: Array<Array<number>> = [];

      // Up
      if (y > 0 && env[x][y - 1] !== notAllowedPattern) {
        const isUp = [x, y - 1];
        allPath.push(isUp);
        pathDirection.push(isUp);
        env[x][y - 1] = notAllowedPattern;
        setSnakePathFind(allPath);
      }

      //   Down
      if (y < height - 1 && env[x][y + 1] !== notAllowedPattern) {
        const isDown = [x, y + 1];
        allPath.push(isDown);
        pathDirection.push(isDown);
        env[x][y + 1] = notAllowedPattern;
        setSnakePathFind(allPath);
      }

      //  Left
      if (x > 0 && env[x - 1][y] !== notAllowedPattern) {
        const isLeft = [x - 1, y];
        allPath.push(isLeft);
        pathDirection.push(isLeft);
        env[x - 1][y] = notAllowedPattern;
        setSnakePathFind(allPath);
      }

      //  Right
      if (x < width - 1 && env[x + 1][y] !== notAllowedPattern) {
        const isRight = [x + 1, y];
        allPath.push(isRight);
        pathDirection.push(isRight);
        env[x + 1][y] = notAllowedPattern;
        setSnakePathFind(allPath);
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

      if (paths.length <= 1) {
        for (let i = 0; i < pathDirection.length; i += 1)
          paths.push(pathDirection[i]);
      } else {
        for (let i = 0; i < paths.length; i += 1) {
          const distPath = distanceBetweenTwoPoints(
            paths[i][0],
            paths[i][1],
            snakeFood[0],
            snakeFood[1]
          );
          const direction = pathDirection.shift();
          if (direction) {
            const distDirection = distanceBetweenTwoPoints(
              direction[0],
              direction[1],
              snakeFood[0],
              snakeFood[1]
            );
            if (distDirection < distPath) {
              paths.splice(i, 0, direction);
              i = 0;
            }
          }
        }
        for (let i = 0; i < pathDirection.length; i += 1)
          paths.push(pathDirection[i]);
      }
      paths.shift();
      setSnakePathFind(allPath);
      if (x === snakeFood[0] && y === snakeFood[1]) break;
    }
  }, [setSnakePathFind, snakeBody, snakeFood]);
  // useFrameLoop(() => {
  //   moveSnakeBody();
  // });

  return (
    <div className="mt-24 -z-10">
      <div className="flex">
        <button
          className="btn btn-primary"
          type="button"
          onClick={moveSnakeBody}
        >
          Move
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => changeMovement('U')}
        >
          ^
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => changeMovement('D')}
        >
          v
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => changeMovement('L')}
        >
          {'<'}
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => changeMovement('R')}
        >
          {'>'}
        </button>
      </div>
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
                  <div
                    className="absolute w-5 h-5 bg-base-300 shadow-sm rounded-sm "
                    style={{
                      left: `${i * 22 + 5}px`,
                      top: `${j * 22 + 5}px`,
                    }}
                    key={rowKey}
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
          const snakeKey = `${i}_snake_path`;
          return (
            <>
              <div
                className="absolute w-5 h-5 bg-base-100 border-2 border-primary opacity-60 shadow-sm rounded-sm"
                key={snakeKey}
                style={{
                  left: `${y[0] * 22 + 5}px`,
                  top: `${y[1] * 22 + 5}px`,
                }}
              />
              <div
                className="absolute w-5 h-5 bg-primary opacity-20 shadow-sm rounded-sm"
                key={snakeKey}
                style={{
                  left: `${y[0] * 22 + 5}px`,
                  top: `${y[1] * 22 + 5}px`,
                }}
              />
            </>
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
