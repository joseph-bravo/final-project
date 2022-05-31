import React from 'react';
import SarRenderToPng from '../components/sar-renderer';
import processSarBuffer from '../lib/sar-parse';

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      fileParsed: null,
      title: '',
      description: '',
      tags: '',
      isErrorAlertOpen: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.fileLoad = this.fileLoad.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount() {
    window.addEventListener('drop', this.handleDrop);
    window.addEventListener('dragenter', this.cancelDefaults);
    window.addEventListener('dragover', this.cancelDefaults);
  }

  cancelDefaults(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    this.fileLoad(file);
  }

  componentWillUnmount() {
    window.removeEventListener('drop', this.handleDrop);
    window.removeEventListener('dragenter', this.cancelDefaults);
    window.removeEventListener('dragover', this.cancelDefaults);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleFileChange(event) {
    this.closeAlert();
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    this.fileLoad(file);
  }

  fileLoad(file) {
    file
      .arrayBuffer()
      .then(processSarBuffer)
      .then(fileParsed => {
        this.setState({ file, fileParsed, isErrorAlertOpen: false });
      })
      .catch(() => {
        this.setState({ isErrorAlertOpen: true, file: null, fileParsed: null });
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  closeAlert() {
    this.setState({ isErrorAlertOpen: false });
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-4 ">
        <div className="rounded-box flex justify-center bg-base-100 p-2">
          <label htmlFor="fileInput" className="btn btn-secondary btn-block">
            Upload .sar File
            <input
              onChange={this.handleFileChange}
              id="fileInput"
              type="file"
              name="file"
              accept=".sar"
              hidden
            />
          </label>
        </div>

        {
          // prettier-ignore
          this.state.isErrorAlertOpen
            ? <ErrorAlert closeAlert={this.closeAlert} />
            : null
        }

        {
          // prettier-ignore
          this.state.fileParsed
            ? (
                <>
                <div className='rounded-box p-4 bg-base-100 prose min-w-full'>
                  <h3>preview</h3>
                  <SarRenderToPng sar={this.state.fileParsed} />
                </div>
                <div className="rounded-box flex flex-col gap-4 bg-base-100 py-4">
                  <TextInput
                    label="post name"
                    name="title"
                    value={this.state.title}
                    handleChange={this.handleChange}
                  />
                  <TextInput
                    label="description"
                    name="description"
                    value={this.state.description}
                    handleChange={this.handleChange}
                  />
                  <TextInput
                    label="tags"
                    name="tags"
                    value={this.state.tags}
                    handleChange={this.handleChange}
                  />
                </div>
                </>
              )
            : null
        }
      </form>
    );
  }
}

function TextInput(props) {
  return (
    <div className="form-control flex flex-col gap-2 px-4">
      <label>
        <span className="text-xl font-semibold">{props.label}</span>
      </label>
      <input
        type="text"
        className="input h-fit w-full bg-base-300 p-2 leading-none"
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
      />
    </div>
  );
}

function ErrorAlert(props) {
  const closeAlert = props.closeAlert;
  return (
    <div
      className="rounded-box flex items-center justify-between bg-error p-4 text-error-content"
      onClick={closeAlert}>
      <div className="flex gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 flex-shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h4>error! unable to load file.</h4>
      </div>

      <div className="flex-none">
        <button className="btn btn-ghost" onClick={closeAlert}>
          <span className="material-icons">close</span>
        </button>
      </div>
    </div>
  );
}
