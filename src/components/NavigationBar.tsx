/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BeakerIcon, Bars4Icon } from '@heroicons/react/24/solid';
import daisyUIThemes from '../assets/daisyUIThemes.json';
import useChangeTheme from '../helpers/useChangeTheme';
import Background from './Background';

const routers = [
  { link: '/', text: 'Home' },
  { link: '/About', text: 'About' },
  { link: '/Project', text: 'Projects' },
  { link: '/Contact', text: 'Contact' },
];

type NavigationProps = {
  children: JSX.Element | JSX.Element[] | string | string[];
};

function NavigationBar({ children }: NavigationProps) {
  const { pathname } = useLocation();
  const [theme, changeTheme] = useChangeTheme('theme', '');

  return (
    <main data-theme={theme}>
      <div className="drawer">
        <input
          id="navigation-drawer"
          title="navigation-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content ">
          <Background />
          <div className="relative flex items-start justify-center sm:pt-0 ">
            <div className="fixed top-0 navbar  max-w-7xl">
              <div className="flex-1 ">
                <nav className="navbar top-0 fixed max-w-7xl ">
                  <div className="navbar top-0 -z-10 left-0 bg-base-100 fixed  bg-opacity-30 backdrop-filter backdrop-blur-md" />
                  <div className="flex-1">
                    <Link to="/">
                      <span className="btn btn-ghost normal-case text-xl z-20 ">
                        Zalven
                      </span>
                    </Link>
                  </div>
                  <div className="visible sm:invisible">
                    <div className="dropdown dropdown-end mx-5">
                      <label htmlFor="navigation-drawer">
                        <Bars4Icon className="w-8" />
                      </label>
                    </div>
                  </div>
                  <div className="hidden sm:flex">
                    <ul className="menu menu-horizontal p-0">
                      {routers.map((value) => {
                        return (
                          <li key={value.link} className="active:bg-none">
                            <Link to={value.link} id={value.link}>
                              <span
                                className={
                                  pathname === value.link ? 'text-primary' : ''
                                }
                              >
                                {value.text}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="dropdown dropdown-end s">
                      <button
                        type="button"
                        tabIndex={0}
                        className="btn m-1 btn-primary"
                        title="theme-selector"
                      >
                        <BeakerIcon className="w-6" />
                      </button>
                      <div
                        title="theme-dropdown"
                        tabIndex={0}
                        className="dropdown-content menu p-2 bg-base-100 rounded-box w-52 shadow-2xl"
                      >
                        <div className="h-52 overflow-y-auto overflow-x-hidden">
                          {daisyUIThemes.themes.map((value, index) => {
                            return (
                              <button
                                type="button"
                                key={value}
                                title={value}
                                aria-label={value}
                                data-title={index}
                                onClick={() => changeTheme(value)}
                                className={
                                  value === theme
                                    ? 'btn btn-active w-full shadow overflow-hidden'
                                    : 'btn btn-ghost w-full shadow-none overflow-hidden'
                                }
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
            <div className="flex-0 w-full max-w-7xl ">{children}</div>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="navigation-drawer" className="drawer-overlay" />
          <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
            {routers.map((value) => {
              return (
                <li
                  key={value.link}
                  id={value.link}
                  className={pathname === value.link ? 'text-primary' : ''}
                >
                  <Link to={value.link}>{value.text}</Link>
                </li>
              );
            })}
            <li>
              <label htmlFor="my-modal" className="modal-button">
                <BeakerIcon className="w-5" /> Select Theme
              </label>
            </li>
          </ul>
        </div>
      </div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="h-52 overflow-y-auto overflow-x-hidden ">
            {daisyUIThemes.themes.map((value, index) => {
              return (
                <button
                  type="button"
                  key={value}
                  title={value}
                  aria-label={value}
                  data-title={index}
                  onClick={() => changeTheme(value)}
                  className={
                    value === theme
                      ? 'btn btn-active w-full shadow overflow-hidden'
                      : 'btn btn-ghost w-full shadow-none  overflow-hidden'
                  }
                >
                  {value}
                </button>
              );
            })}
          </div>
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn btn-outline ">
              Close
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NavigationBar;
