import React from 'react';
import SymbolArtCard from '../components/symbol-art-card';
import AppContext from '../lib/app-context';
import SearchBar from '../components/search-bar';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ErrorDisplay from '../components/error-display';

class CatalogPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentlyViewing: [],
      showingMatchesFor: '',
      userid: null,
      username: null,
      loading: true,
      errorMessage: null
    };
    this.setCatalog = this.setCatalog.bind(this);
    this.initializeCatalog = this.initializeCatalog.bind(this);
  }

  componentDidMount() {
    const { userid } = this.props.router.params;
    this.setState({ userid });
    this.initializeCatalog();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userid !== this.props.router.params.userid) {
      this.setState({
        userid: this.props.router.params.userid,
        username: null,
        loading: true
      });
      this.initializeCatalog();
    }
  }

  initializeCatalog() {
    this.setState({ loading: true, errorMessage: null });
    if (this.state.userid) {
      fetch(`/api/catalog/user/${this.state.userid}`)
        .then(res => {
          return Promise.all([res, res.json()]);
        })
        .then(tuple => {
          const [res, resBody] = tuple;
          if (!res.ok) {
            this.setState({
              currentlyViewing: [],
              username: null,
              loading: false,
              errorMessage: {
                status: res.status,
                message: resBody.error ? resBody.error : res.statusText
              }
            });
            return;
          }
          this.setState({
            currentlyViewing: resBody.posts ? resBody.posts : [],
            username: resBody.username,
            loading: false
          });
        })
        .catch(console.error);
    } else {
      fetch('/api/catalog')
        .then(res => {
          return Promise.all([res, res.json()]);
        })
        .then(tuple => {
          const [res, resBody] = tuple;
          if (!res.ok) {
            this.setState({
              errorMessage: {
                status: res.status,
                message: resBody.error ? resBody.error : res.statusText
              }
            });
            return;
          }
          this.setCatalog(resBody);
        })
        .catch(console.error);
    }
  }

  setCatalog(posts, currentQuery) {
    this.setState({ currentlyViewing: posts, currentQuery, loading: false });
  }

  render() {
    if (this.state.loading) {
      return <></>;
    }

    if (this.state.errorMessage && !this.state.loading) {
      return <ErrorDisplay {...this.state.errorMessage} />;
    }

    return (
      <div className="flex flex-col items-center gap-8">
        <div>
          {
            // prettier-ignore
            this.state.userid
              ? (
                <div className='bg-base-100 rounded-box px-16 py-4 text-3xl'>
                  <h3>posts from: <span className='font-bold'>@{this.state.username}</span></h3>
                </div>
                )
              : <SearchBar
            setCatalog={this.setCatalog}
            initializeCatalog={this.initializeCatalog}
            currentQuery={this.state.currentQuery}
            />
          }
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
          (!(this.state.currentlyViewing.length > 0) && !this.state.loading)
            ? <div className="alert alert-warning w-fit font-semibold text-xl">unable to find any posts.</div>
            : null
        }
      </div>
    );
  }
}
CatalogPage.contextType = AppContext;

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

export default withRouter(CatalogPage);
