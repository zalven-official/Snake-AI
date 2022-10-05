import React, { RefObject, useRef, useEffect, useState } from 'react';
import { BuildingOffice2Icon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import {
  AiFillFacebook,
  AiFillGithub,
  AiOutlineTwitter,
  AiFillLinkedin,
  AiOutlineInstagram,
  AiOutlineArrowRight,
} from 'react-icons/ai';
import { FaDiscord } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useOnScroll from '../helpers/useOnScroll';

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};
function Home() {
  const mouseSroll: RefObject<HTMLInputElement> = useRef(null);
  // const navigate = useNavigate();
  // const [canNavigate, setCanNavigate] = useState<boolean>(false);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setCanNavigate(true);
  //   }, 1000);
  // }, []);
  // useOnScroll(mouseSroll, (event) => {
  //   if (event.deltaY > 0 && canNavigate) {
  //     navigate('/About');
  //   }
  // });
  return (
    <div>
      <motion.div
        ref={mouseSroll}
        variants={container}
        className="hero min-h-screen overflow-hidden "
        initial="hidden"
        animate="visible"
      >
        <div className="hero-content text-center overflow-hidden ">
          <div className="max-w-md p-5">
            <p className="py-2 text-2xl ">Hello, I m</p>
            <motion.h1 variants={item} className="text-6xl font-bold ">
              <motion.span
                animate={{ x: [50, 150, 50], opacity: 1, scale: 1 }}
                transition={{
                  duration: 3,
                  delay: 0.1,
                  ease: [0.5, 0.71, 1, 1.5],
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.2 }}
                className="text-primary hover:text-secondary"
              >
                Z
              </motion.span>
              alven{' '}
              <motion.span
                animate={{ x: [50, 150, 50], opacity: 1, scale: 1 }}
                transition={{
                  duration: 3,
                  delay: 0.1,
                  ease: [0.5, 0.71, 1, 1.5],
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.2 }}
                className="text-primary hover:text-secondary"
              >
                B
              </motion.span>
              lue
            </motion.h1>

            <motion.p
              variants={item}
              className="py-2 text-xl font-semibold  flex my-3 items-center justify-center gap-5"
            >
              <BuildingOffice2Icon className="w-8  text-primary text-center" />
              Computer Science Student
            </motion.p>
            <motion.p className="py-6 mx-10 sm:mx-0" variants={item}>
              Freelance Web developer and Mobile developer. Specializing Data
              Science, Machine learning and, Software Artificial Intelligence
            </motion.p>
            <motion.div
              className="flex mb-5 items-center justify-center gap-5 mx-10 sm:mx-0"
              variants={item}
            >
              <AiFillGithub size={30} className="m-2" />
              <AiFillLinkedin size={30} className="m-2" />
              <AiOutlineTwitter size={30} className="m-2" />
              <FaDiscord size={30} className="m-2" />
              <AiFillFacebook size={30} className="m-2" />
              <AiOutlineInstagram size={30} className="m-2" />
            </motion.div>
            <motion.div variants={item}>
              <Link to="/About" className="btn btn-primary mt-9">
                Know More About me?{' '}
                <AiOutlineArrowRight className="m-2" size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

Home.propTypes = {};

export default Home;
