import React from 'react';
import SymbolArtCard from '../components/symbol-art-card';
import AppContext from '../lib/app-context';
import SearchBar from '../components/search-bar';

export default class CatalogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyViewing: []
    };
    this.setCatalog = this.setCatalog.bind(this);
  }

  componentDidMount() {
    fetch('/api/catalog')
      .then(res => res.json())
      .then(res => {
        this.setState({ currentlyViewing: res });
      })
      .catch(console.error);
  }

  setCatalog(posts) {
    this.setState({ currentlyViewing: posts });
  }

  render() {
    return (
      <div className="flex flex-col items-center gap-8">
        <SearchBar setCatalog={this.setCatalog} />
        <div className="grid gap-4 sm:grid-cols-2">
          {this.state.currentlyViewing.map(symbolArt => {
            return (
              <SymbolArtCard key={symbolArt.postId} symbolArt={symbolArt} />
            );
          })}
        </div>
      </div>
    );
  }
}
CatalogPage.contextType = AppContext;
