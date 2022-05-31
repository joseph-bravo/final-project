import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <header
        className="navbar rounded-box sticky
        top-4 mx-auto mb-8 flex w-11/12 max-w-3xl items-center
        justify-between bg-primary px-4 text-primary-content shadow-md">
        <div className="">
          <button className="btn btn-primary">
            <span className="material-icons">arrow_back</span>
          </button>
        </div>

        <div className="flex-1 justify-center md:justify-start md:px-2">
          <h1 className="text-center text-4xl font-black leading-none">
            New Post
          </h1>
        </div>

        <div className="md:hidden">
          <div className="dropdown dropdown-end">
            <label tabIndex="0" className="btn btn-primary">
              <span className="material-icons">menu</span>
            </label>
            <ul
              tabIndex="0"
              className="dropdown-content menu rounded-box mt-4 w-52 bg-primary-focus p-2 shadow">
              <li>
                <a>log out</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hidden md:flex">
          <button className="btn btn-primary text-xl lowercase">Log Out</button>
        </div>
      </header>
    );
  }
}
