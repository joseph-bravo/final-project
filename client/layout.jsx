import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/header';

export default class Layout extends React.Component {
  render() {
    return (
      <main className="min-h-screen bg-base-300">
        <Header />
        <div className="mx-auto w-11/12 max-w-3xl">
          <Outlet />
        </div>
      </main>
    );
  }
}
