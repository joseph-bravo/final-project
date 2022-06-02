import React from 'react';
import SymbolArtCard from '../components/symbol-art-card';
import { trackWindowScroll } from 'react-lazy-load-image-component';

class CatalogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyViewing: []
    };
  }

  componentDidMount() {
    fetch(`/api/catalog/${this.state.currentlyViewing.length}`)
      .then(res => res.json())
      .then(res => {
        this.setState({ currentlyViewing: res });
      })
      .catch(console.error);
  }

  render() {
    return (
      <div className="masonry md:masonry-sm">
        {this.state.currentlyViewing.map(symbolArt => {
          return <SymbolArtCard key={symbolArt.postId} symbolArt={symbolArt} />;
        })}
      </div>
    );
  }
}

export default trackWindowScroll(CatalogPage);
