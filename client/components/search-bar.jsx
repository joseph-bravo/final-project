import React from 'react';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
      title: true,
      description: true,
      tags: true,
      username: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearFormAndInitialize = this.clearFormAndInitialize.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { q, title, description, tags, username } = this.state;

    if (q.trim() === '') {
      this.props.initializeCatalog();
      return;
    }

    const cols = [
      title ? 'title' : '',
      description ? 'description' : '',
      tags ? 'tags' : '',
      username ? 'username' : ''
    ].join(',');
    const searchParams = new URLSearchParams('');
    searchParams.append('q', q);
    searchParams.append('cols', cols);
    fetch('/api/posts/search?' + searchParams.toString())
      .then(res => res.json())
      .then(res => this.props.setCatalog(res, q.trim()));
  }

  clearFormAndInitialize() {
    this.setState({
      q: '',
      title: true,
      description: true,
      tags: true,
      username: true
    });
    this.props.initializeCatalog();
  }

  handleChange(event) {
    if (event.target.type === 'checkbox') {
      if (
        event.target.checked === false &&
        [
          this.state.title,
          this.state.description,
          this.state.tags,
          this.state.username
        ].reduce((count, setting) => {
          if (setting) return (count += 1);
          return count;
        }, 0) === 1
      ) {
        return;
      }
      this.setState({ [event.target.name]: event.target.checked });
      return;
    }
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div className="flex flex-col gap-2">
        <form onSubmit={this.handleSubmit}>
          <div className="rounded-box flex items-center gap-4 bg-base-100 px-4 py-2 shadow-sm">
            <div className="form-control w-full">
              <div className="input-group ">
                <input
                  type="text"
                  placeholder="search..."
                  className="input input-bordered w-full"
                  name="q"
                  value={this.state.q}
                  onChange={this.handleChange}
                />
                <button className="btn btn-square">
                  <span className="material-icons bg-transparent p-0">
                    search
                  </span>
                </button>
              </div>
            </div>
            <div className="dropdown-end dropdown">
              <label tabIndex="0" className="btn m-1">
                options
              </label>
              <ul
                tabIndex="0"
                className="dropdown-content rounded-box w-52 bg-base-100 p-2 shadow">
                <li>
                  <DaisyToggle
                    label="title"
                    toggled={this.state.title}
                    onChange={this.handleChange}
                  />
                </li>
                <li>
                  <DaisyToggle
                    label="description"
                    toggled={this.state.description}
                    onChange={this.handleChange}
                  />
                </li>
                <li>
                  <DaisyToggle
                    label="tags"
                    toggled={this.state.tags}
                    onChange={this.handleChange}
                  />
                </li>
                <li>
                  <DaisyToggle
                    label="username"
                    toggled={this.state.username}
                    onChange={this.handleChange}
                  />
                </li>
              </ul>
            </div>
          </div>
        </form>
        {
          // prettier-ignore
          this.props.currentQuery
            ? <div className='alert alert-info max-w-md py-2'>
                  <div>
                    <h2>showing matches for &quot;<span className="font-bold">{this.props.currentQuery}</span>&quot;</h2>
                  </div>
                  <button className='btn btn-circle btn-ghost' onClick={this.clearFormAndInitialize}><div className="material-icons">close</div></button>
                </div>
            : <></>
        }
      </div>
    );
  }
}

function DaisyToggle(props) {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text font-semibold">{props.label}</span>
        <input
          type="checkbox"
          className="toggle "
          name={props.label}
          checked={props.toggled}
          onChange={props.onChange}
        />
      </label>
    </div>
  );
}
