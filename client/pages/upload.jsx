import React from 'react';

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      title: '',
      description: '',
      tags: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    // event.preventDefault();
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    this.setState({ file });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    console.log(this.state);

    return (
      <form className="flex flex-col gap-8">
        <label htmlFor="fileInput" className="btn btn-primary">
          Upload .sar
          <input
            onChange={this.handleFileChange}
            id="fileInput"
            type="file"
            name="file"
            accept=".sar"
            hidden
          />
        </label>
        <div className="rounded-box flex flex-col gap-4 bg-base-100 py-4">
          <div className="form-control flex flex-col gap-2 px-4">
            <label>
              <span className="text-xl font-semibold">post name</span>
            </label>
            <input
              type="text"
              className="input h-fit w-full bg-base-300 p-2 leading-none"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-control flex flex-col gap-2 px-4">
            <label>
              <span className="text-xl font-semibold">description</span>
            </label>
            <input
              type="text"
              className="input h-fit w-full bg-base-300 p-2 leading-none"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-control flex flex-col gap-2 px-4">
            <label>
              <span className="text-xl font-semibold">tags</span>
            </label>
            <input
              type="text"
              className="input h-fit w-full bg-base-300 p-2 leading-none"
              name="tags"
              value={this.state.tags}
              onChange={this.handleChange}
            />
          </div>
        </div>
      </form>
    );
  }
}
