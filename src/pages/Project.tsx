import React, { RefObject, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOnScroll from '../helpers/useOnScroll';

function Project() {
  const mouseSroll: RefObject<HTMLInputElement> = useRef(null);
  // const navigate = useNavigate();
  // const [canNavigate, setCanNavigate] = useState<boolean>(false);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setCanNavigate(true);
  //   }, 1000);
  // }, []);
  // useOnScroll(mouseSroll, (event) => {
  //   if (event.deltaY < 0 && canNavigate) {
  //     navigate('/About');
  //   }
  //   if (event.deltaY > 0 && canNavigate) {
  //     navigate('/Contact');
  //   }
  // });
  return <div>Project</div>;
}

Project.propTypes = {};

export default Project;
