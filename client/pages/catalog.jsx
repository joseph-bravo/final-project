import React from 'react';
import SymbolArtCard from '../components/symbol-art-card';
import AppContext from '../lib/app-context';
import SearchBar from '../components/search-bar';

export default class CatalogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyViewing: [],
      showingMatchesFor: ''
    };
    this.setCatalog = this.setCatalog.bind(this);
    this.initializeCatalog = this.initializeCatalog.bind(this);
  }

  componentDidMount() {
    this.initializeCatalog();
  }

  initializeCatalog() {
    fetch('/api/catalog')
      .then(res => res.json())
      .then(res => {
        this.setCatalog(res);
      })
      .catch(console.error);
  }

  setCatalog(posts, currentQuery) {
    this.setState({ currentlyViewing: posts, currentQuery });
  }

  render() {
    return (
      <div className="flex flex-col items-center gap-8">
        <div>
          <SearchBar
            setCatalog={this.setCatalog}
            initializeCatalog={this.initializeCatalog}
            currentQuery={this.state.currentQuery}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {this.state.currentlyViewing.map(symbolArt => {
            return (
              <SymbolArtCard key={symbolArt.postId} symbolArt={symbolArt} />
            );
          })}
        </div>
        {
          // prettier-ignore
          !(this.state.currentlyViewing.length > 0)
            ? <div className="alert alert-warning w-fit">unable to find anything.</div>
            : null
        }
      </div>
    );
  }
}
CatalogPage.contextType = AppContext;
