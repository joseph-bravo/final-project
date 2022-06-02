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
  }

  playSound(index) {
    if (this.sound) {
      this.sound.pause();
    }
    if (index === 0 || index === 1) return;
    this.sound = new Audio('res/' + sounds[index]);
    this.sound.play();
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
      <div className="grid gap-4 md:grid-cols-2">
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
