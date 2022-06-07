import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UploadPage from './pages/upload';
import Layout from './layout';
import CatalogPage from './pages/catalog';
import sounds from './lib/sound-catalog.json';
import AppContext from './lib/app-context';
import SinglePostPage from './pages/single-post';
import NotFoundPage from './pages/not-found';
import AuthPage from './pages/auth';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.playSound = this.playSound.bind(this);
    this.sounds = sounds.map(sound => {
      if (sound.path === '') return null;
      return new Audio(`/res/${sound.path}`);
    });

    this.setUser = this.setUser.bind(this);
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
    } catch (e) {
      console.error(e);
    }
  }

  setUser(user) {
    this.setState({ user });
  }

  render() {
    const context = {
      user: this.state.user,
      setState: this.setUser,
      playSound: this.playSound
    };
    return (
      <AppContext.Provider value={context}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Layout />}>
              <Route index element={<CatalogPage />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="posts">
                <Route path=":id" element={<SinglePostPage />} />
              </Route>
              <Route path="auth">
                <Route path="sign-up" element={<AuthPage action="sign-up" />} />
                <Route path="sign-in" element={<AuthPage action="sign-in" />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    );
  }
}
