/* eslint-disable react/prefer-stateless-function */
import React, { RefObject, useState, useEffect, useRef } from 'react';
import useWindowDimensions from '../helpers/useWindowDimensions';
import useIsMounted from '../helpers/useIsMounted';
import useFrameLoop from '../helpers/useFrameLoop';
import useMousePointerPosition from '../helpers/useMousePointerPosition';
import useOnClickOutside from '../helpers/useOnClickOutside';
import useOnScroll from '../helpers/useOnScroll';
import {
  getRandomInt,
  randomChoice,
  randomChoiceString,
} from '../helpers/randomizer';
import { checkAPoint, distanceBetweenTwoPoints } from '../helpers/colliders';

interface CircleProperties {
  speedX: number;
  speedY: number;
  randomX: number;
  randomY: number;
  radius: number;
}
interface LineProperties {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  dist: number;
  maxDist: number;
}

function generateCircle(
  randomX: number,
  randomY: number,
  speedX: number,
  speedY: number
) {
  return {
    randomX,
    randomY,
    speedX,
    speedY,
    radius: 5,
  };
}
function generateCircles(
  numberOfCircles: number,
  width: number,
  height: number
) {
  const result: Array<CircleProperties> = [];
  for (let i = 0; i < numberOfCircles; i += 1)
    result.push(
      generateCircle(
        getRandomInt(0, width),
        getRandomInt(0, height),
        getRandomInt(1, 4) * randomChoice([-1, 1]),
        getRandomInt(1, 4) * randomChoice([-1, 1])
      )
    );

  return result;
}
function moveCircles(
  circles: Array<CircleProperties>,
  width: number,
  height: number,
  clientX: number,
  clientY: number
) {
  const circleMove: Array<CircleProperties> = circles;
  const linesMove: Array<LineProperties> = [];
  const maxDist = Math.min(width, height) * 0.25;
  const mouseMaxDist = Math.max(width, height) * 0.2;

  for (let i = 0; i < circleMove.length; i += 1) {
    circleMove[i].randomX += circleMove[i].speedX;
    circleMove[i].randomY += circleMove[i].speedY;

    if (
      circleMove[i].randomX > width - circleMove[i].radius ||
      circleMove[i].randomX < circleMove[i].radius
    ) {
      circleMove[i].speedX = -circleMove[i].speedX;
    }
    if (
      circleMove[i].randomY > height - circleMove[i].radius ||
      circleMove[i].randomY < circleMove[i].radius
    ) {
      circleMove[i].speedY = -circleMove[i].speedY;
    }

    // Check if point circle is inside the line
    if (
      checkAPoint(
        circleMove[i].randomX,
        circleMove[i].randomY,
        clientX,
        clientY,
        mouseMaxDist
      )
    ) {
      const rad: number = circleMove[i].radius / 2;
      for (let j = i + 1; j < circleMove.length; j += 1) {
        // calculate distance between 2 circles
        const distance = distanceBetweenTwoPoints(
          circleMove[i].randomX - rad,
          circleMove[i].randomY - rad,
          circleMove[j].randomX - rad,
          circleMove[j].randomY - rad
        );
        if (distance <= maxDist)
          linesMove.push({
            x0: circleMove[i].randomX,
            y0: circleMove[i].randomY,
            x1: circleMove[j].randomX,
            y1: circleMove[j].randomY,
            dist: distance,
            maxDist,
          });
      }
    }
  }

  return { circleMove, linesMove };
}
function Background() {
  const mouseClick: RefObject<HTMLInputElement> = useRef(null);
  const mouseSroll: RefObject<HTMLInputElement> = useRef(null);
  const isMounted = useIsMounted();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [time, setTime] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deltaTime, setDeltaTime] = useState<number>(0);
  const { width, height } = useWindowDimensions();
  const { clientX, clientY } = useMousePointerPosition();
  const [circles, setCircles] = useState<Array<CircleProperties>>([]);
  const [lines, setLines] = useState<Array<LineProperties>>([]);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1);

  useEffect(() => {
    if (isMounted()) {
      const circleCount = Math.min(width, height) * 0.05;
      setCircles(
        generateCircles(circleCount <= 100 ? circleCount : 100, width, height)
      );
    }
  }, [isMounted, height, width]);

  useOnClickOutside(mouseClick, () => {
    circles.shift();
    circles.push(
      generateCircle(
        clientX,
        clientY,
        randomChoice([-scrollSpeed, scrollSpeed]),
        randomChoice([-scrollSpeed, scrollSpeed])
      )
    );
  });
  useOnScroll(mouseSroll, (event) => {
    const speedAdjustment = 0.2;
    const maxSpeedAdjustment = 10;
    if (event.deltaY < 0 && scrollSpeed <= maxSpeedAdjustment) {
      setScrollSpeed(scrollSpeed + speedAdjustment);
    }
    if (event.deltaY > 0 && scrollSpeed >= 0) {
      setScrollSpeed(scrollSpeed - speedAdjustment);
    }
    for (let i = 0; i < circles.length; i += 1) {
      circles[i].speedX = scrollSpeed * (circles[i].speedX <= 0 ? -1 : 1);
      circles[i].speedY = scrollSpeed * (circles[i].speedY <= 0 ? -1 : 1);
    }
  });
  useFrameLoop((timeValue, deltaTimeValue) => {
    const { linesMove } = moveCircles(circles, width, height, clientX, clientY);
    setLines(linesMove);
    setTime(timeValue);
    setDeltaTime(deltaTimeValue);
  });
  return (
    <div ref={mouseSroll}>
      <div
        className="fixed left-0 top-0 h-full w-full bg-inherit overflow-hidden "
        ref={mouseClick}
      >
        {lines?.map((value, index) => {
          const keyName = `lineNumber${index}`;

          const thikness = `${
            (value.maxDist - value.dist) / value.maxDist / 2
          }em`;
          const opacity = `${
            ((value.maxDist - value.dist) / value.maxDist) * 150
          }%`;
          const selected = randomChoiceString([
            'text-primary',
            'text-secondary',
          ]);
          return (
            <div
              key={keyName}
              className="absolute"
              style={{
                opacity,
              }}
            >
              <svg
                className={`fill-current ${selected}`}
                width={width}
                height={height}
                stroke="currentColor"
              >
                <line
                  x1={value.x0}
                  y1={value.y0}
                  x2={value.x1}
                  y2={value.y1}
                  strokeWidth={thikness}
                />
              </svg>
            </div>
          );
        })}
        {circles?.map((value, index) => {
          const keyName = `circleNumber${index}`;
          const selected = randomChoiceString(['text-current', 'text-primary']);
          return (
            <div key={keyName}>
              <svg
                width={width}
                height={height}
                className={`fixed  fill-current overflow-hidden ${selected}`}
              >
                <circle
                  cx={value.randomX}
                  cy={value.randomY}
                  r={value.radius - 3}
                />
              </svg>
              <svg
                width={width}
                height={height}
                className={`fixed  fill-current overflow-hidden  blur-md ${selected}`}
              >
                <circle
                  cx={value.randomX}
                  cy={value.randomY}
                  r={value.radius - 3}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Background.propTypes = {};

export default Background;
