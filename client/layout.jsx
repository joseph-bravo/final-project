import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/header';
import EditModal from './components/edit-modal';
import AppContext from './lib/app-context';

export default class Layout extends React.Component {
  render() {
    return (
      <>
        <EditModal
          isOpen={this.context.editing}
          editing={this.context.editing}
          closeModal={() => this.context.setEditing(null)}
        />
        <main className="min-h-screen bg-base-300 pb-8">
          <Header />
          <div className="mx-auto w-11/12 max-w-4xl">
            <Outlet />
          </div>
        </main>
      </>
    );
  }
}
Layout.contextType = AppContext;
