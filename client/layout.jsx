import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/header';
import EditModal from './components/edit-modal';
import AppContext from './lib/app-context';

export default class Layout extends React.Component {
  render() {
    return (
      <>
        <ToastContainer
          position="bottom-center"
          autoClose={2500}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        />
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
