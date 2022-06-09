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
import jwtDecode from 'jwt-decode';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
      username: null
    };
    this.playSound = this.playSound.bind(this);
    this.sounds = sounds.map(sound => {
      if (sound.path === '') return null;
      return new Audio(`/res/${sound.path}`);
    });
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const userjwt = localStorage.getItem('userjwt');
    if (userjwt && userjwt !== 'undefined') {
      this.login(userjwt);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userToken !== this.state.userToken) {
      if (!this.state.userToken) {
        this.setState({ username: null });
        return;
      }
      const { username } = jwtDecode(this.state.userToken);
      this.setState({ username });
    }
  }

  login(userToken) {
    localStorage.setItem('userjwt', userToken);
    this.setState({ userToken });
  }

  logout() {
    localStorage.removeItem('userjwt');
    this.setState({ userToken: null });
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

  render() {
    const context = {
      ...this.state,
      playSound: this.playSound,
      login: this.login,
      logout: this.logout
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
              <Route path="user">
                <Route path=":userid" element={<CatalogPage />} />
              </Route>
              <Route path="auth">
                <Route
                  path="sign-up"
                  element={<AuthPage action="sign-up" key="sign-up" />}
                />
                <Route
                  path="sign-in"
                  element={<AuthPage action="sign-in" key="sign-in" />}
                />
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
