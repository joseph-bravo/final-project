import React from 'react';
import SymbolArtCard from '../components/symbol-art-card';
import sounds from '../lib/sound-catalog.json';

export default class CatalogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyViewing: []
    };
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

  componentDidMount() {
    fetch('/api/catalog')
      .then(res => res.json())
      .then(res => {
        this.setState({ currentlyViewing: res });
      })
      .catch(console.error);
  }

  render() {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {this.state.currentlyViewing.map(symbolArt => {
          return (
            <SymbolArtCard
              key={symbolArt.postId}
              symbolArt={symbolArt}
              playSound={this.playSound}
            />
          );
        })}
      </div>
    );
  }
}
