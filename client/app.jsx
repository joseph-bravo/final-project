import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UploadPage from './pages/upload';
import Layout from './layout';
import CatalogPage from './pages/catalog';

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CatalogPage />} />
            <Route path="upload" element={<UploadPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}
