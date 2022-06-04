import React from 'react';
import SymbolArtCard from '../components/symbol-art-card';
import AppContext from '../lib/app-context';

export default class CatalogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyViewing: []
    };
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
          return <SymbolArtCard key={symbolArt.postId} symbolArt={symbolArt} />;
        })}
      </div>
    );
  }
}
CatalogPage.contextType = AppContext;
