import React, { useContext, useState } from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import AppContext from '../lib/app-context';
import DaisyModal from './daisy-modal';

export default function Header(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const appContext = useContext(AppContext);
  const homeHeader = 'Symbol Art Vault';
  const paths = [
    {
      path: 'upload',
      header: 'New Post'
    },
    {
      path: 'posts/:id',
      header: 'Viewing Post'
    },
    {
      path: 'auth/sign-up',
      header: 'Sign Up'
    },
    {
      path: 'auth/sign-in',
      header: 'Sign In'
    },
    {
      path: '*',
      header: '404: Not Found'
    },
    {
      path: 'user/:userid',
      header: 'Viewing User'
    }
  ];

  const actions = {
    upload: {
      path: 'upload',
      header: 'new post'
    }
  };

  if (!appContext.userToken) {
    actions.signup = {
      path: 'auth/sign-up',
      header: 'sign up'
    };
    actions.signin = {
      path: 'auth/sign-in',
      header: 'sign in'
    };
  }

  const getActionElements = () => {
    const out = [];
    for (const prop in actions) {
      const action = actions[prop];
      out.push(
        <NavLink
          key={action.path}
          to={action.path}
          className={({ isActive }) =>
            !isActive ? 'btn btn-primary text-xl lowercase' : 'hidden'
          }>
          {action.header}
        </NavLink>
      );
    }
    if (appContext.userToken) {
      const { username } = appContext;
      out.push(
        <button
          key={username}
          className="btn btn-accent btn-sm lowercase"
          onClick={() => setIsModalOpen(true)}>
          @{username}
        </button>
      );
    }
    return out;
  };

  return (
    <>
      <DaisyModal
        label="user actions"
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}>
        <>
          <div className="prose">
            <h3>logged in as @{appContext.username}</h3>
          </div>
          <div className="modal-action">
            <button
              className="btn btn-error"
              onClick={() => {
                appContext.logout();
                setIsModalOpen(false);
              }}>
              log out
            </button>
          </div>
        </>
      </DaisyModal>
      <header
        className="navbar rounded-box sticky top-4 z-50
        mx-auto mb-8 flex w-11/12 max-w-3xl select-none items-center
        justify-center bg-primary px-4 text-primary-content shadow-md">
        <div className="justify-left flex-1 flex-shrink md:flex-none">
          <NavLink
            to="/"
            className={({ isActive }) =>
              !isActive ? 'btn btn-primary' : 'hidden'
            }>
            <span className="material-icons">home</span>
          </NavLink>
        </div>

        <div className="flex-auto justify-center md:justify-start md:px-4">
          <h1 className="text-center text-4xl font-black leading-none">
            <Routes>
              <Route index element={<>{homeHeader}</>} />
              {paths.map(e => {
                return (
                  <Route key={e.path} path={e.path} element={<>{e.header}</>} />
                );
              })}
            </Routes>
          </h1>
        </div>

        <div className="flex flex-1 justify-end md:hidden">
          <div className="dropdown dropdown-end">
            <label tabIndex="0" className="btn btn-primary">
              <span className="material-icons">menu</span>
            </label>
            <ul
              tabIndex="0"
              className="dropdown-content menu rounded-box mt-4 w-52 gap-2 bg-primary-focus p-2 shadow">
              {getActionElements()}
            </ul>
          </div>
        </div>

        <ul className="hidden flex-1 justify-end gap-2 md:flex">
          {getActionElements()}
        </ul>
      </header>
    </>
  );
}
