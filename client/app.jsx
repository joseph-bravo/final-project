import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Upload from './pages/upload';
import Layout from './layout';

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Upload />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}
