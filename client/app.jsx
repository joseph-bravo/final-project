import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UploadPage from './pages/upload';
import Layout from './layout';
import CatalogPage from './pages/catalog';
import sounds from './lib/sound-catalog.json';
import AppContext from './lib/app-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.playSound = this.playSound.bind(this);
    this.sounds = sounds.map(sound => {
      if (sound.path === '') return null;
      return new Audio(`res/${sound.path}`);
    });
  }

  playSound(index) {
    this.sounds.forEach(sound => {
      if (!sound) {
        return;
      }
      sound.pause();
      sound.currentTime = 0;
    });
    if (!this.sounds[index]) {
      return;
    }
    try {
      this.sounds[index].play();
    } catch (e) {}
  }

  render() {
    const context = {
      state: this.state,
      setState: this.setState,
      playSound: this.playSound
    };
    return (
      <AppContext.Provider value={context}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<CatalogPage />} />
              <Route path="upload" element={<UploadPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    );
  }
}
