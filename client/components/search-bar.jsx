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
  }

  handleSubmit(e) {
    e.preventDefault();
    const { q, title, description, tags, username } = this.state;
    const cols = [
      title ? 'title' : '',
      description ? 'description' : '',
      tags ? 'tags' : '',
      username ? 'username' : ''
    ].join(',');
    const searchParams = new URLSearchParams('');
    searchParams.append('q', q);
    searchParams.append('cols', cols);
    console.log('/api/posts/search?' + searchParams.toString());
    fetch('/api/posts/search?' + searchParams.toString())
      .then(res => res.json())
      .then(console.log);
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
      <form onSubmit={this.handleSubmit}>
        <div className="rounded-box flex items-center gap-16 bg-base-100 px-4 py-2 shadow-sm">
          <div className="form-control w-full">
            <div className="input-group ">
              <input
                type="text"
                placeholder="search..."
                className="input input-bordered w-full"
                name="q"
                value={this.state.q}
                onChange={this.handleChange}
                required
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
