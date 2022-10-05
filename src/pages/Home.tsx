import React, { useState } from 'react';
import { getRandomInt } from '../helpers/randomizer';
import useFrameLoop from '../helpers/useFrameLoop';

const width = 58;
const height = 38;
const speed = 2;

function isMoveAllowed(snakeMove: string, movement: string) {
  if (snakeMove === 'D') return movement !== 'U';
  if (snakeMove === 'U') return movement !== 'D';
  if (snakeMove === 'R') return movement !== 'L';
  if (snakeMove === 'L') return movement !== 'R';
  return false;
}

function Home() {
  // Snake Properties
  const [snakeBody, setSnakeBody] = useState<Array<Array<number>>>([
    [width / 2, height / 2 - 2],
    [width / 2, height / 2 - 1],
    [width / 2, height / 2],
  ]);
  const [snakeMove, setSnakeMove] = useState<string>('D');

  // Snake Food
  const [snakeFood, setSnakeFood] = useState<Array<number>>([
    getRandomInt(0, width - 1),
    getRandomInt(0, height - 1),
  ]);
  // console.log(getRandomInt(width, height));

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

  // useFrameLoop(() => {
  //   // moveSnakeBody();
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
