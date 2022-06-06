import React from 'react';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
      cols: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.state.
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} onInput={this.handleChange}>
        <div className="form-control w-full">
          <div className="input-group ">
            <input
              type="text"
              placeholder="Search…"
              className="input input-bordered w-full"
              name="q"
              value={this.state.q}
            />
            <button className="btn btn-square">
              <span className="material-icons bg-transparent p-0">search</span>
            </button>
          </div>
        </div>
      </form>
    );
  }
}
