import React from 'react';
import Navigate from '../components/utils/navigate';
import SarRenderToPng from '../components/sar-renderer';
import processSarBuffer from '../lib/sar-parse';
import AppContext from '../lib/app-context';

const descriptionCharLimit = 90;
const titleCharLimit = 25;
const tagCharLimit = 10;
const tagCountLimit = 5;

export default class UploadPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      fileParsed: null,
      title: '',
      description: '',
      tags: '',
      isErrorAlertOpen: false,
      goingBack: false
    };

    this.imageRef = React.createRef();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.fileLoad = this.fileLoad.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.checkFormValues = this.checkFormValues.bind(this);
    this.resetForm = this.resetForm.bind(this);
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

  resetForm() {
    this.setState({
      file: null,
      fileParsed: null,
      title: '',
      description: '',
      tags: '',
      isErrorAlertOpen: false
    });
  }

  componentWillUnmount() {
    window.removeEventListener('drop', this.handleDrop);
    window.removeEventListener('dragenter', this.cancelDefaults);
    window.removeEventListener('dragover', this.cancelDefaults);
  }

  // prettier-ignore
  handleSubmit(event) {
    event.preventDefault();
    const imageSrc = this.imageRef.current.state.imageSrc;
    fetch(imageSrc)
      .then(res => res.blob())
      .then(thumbnailBlob => {
        const formData = new FormData();
        const { soundEffect, layerCount, name } = this.state.fileParsed;

        formData.append('title', this.state.title);
        formData.append('description', this.state.description);
        formData.append('tags', this.state.tags);
        formData.append('filePropsSound', soundEffect);
        formData.append('filePropsLayerCount', layerCount);
        formData.append('filePropsName', name);
        formData.append('sar', this.state.file);
        formData.append('thumbnail', thumbnailBlob, 'thumbnail.png');

        return fetch('/api/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'X-Access-Token': this.context.userToken ? this.context.userToken : ''
          }
        });
      })
      .then(res => res.json())
      .then(({ rows: [postDetails] }) => {
        this.resetForm();
        this.setState({ goingBack: true });
      })
      .catch(console.error);
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
    if (!file) {
      return;
    }
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
    if (event.target.name === 'description') {
      if (event.target.value.length > descriptionCharLimit) {
        return;
      }
    }
    if (event.target.name === 'title') {
      if (event.target.value.length > titleCharLimit) {
        return;
      }
    }
    if (event.target.name === 'tags') {
      const { value } = event.target;
      let tags = value.split(',');
      tags = tags.map(e => e.trim());
      if (tags.length > 5) {
        return;
      }
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        if (tag.length > 10) {
          return;
        }
      }
      event.target.value = event.target.value.toLowerCase();
    }
    this.setState({ [event.target.name]: event.target.value });
  }

  closeAlert() {
    this.setState({ isErrorAlertOpen: false });
  }

  checkFormValues() {
    const { file, title, description } = this.state;
    if (!file || !title || !description) return false;
    return true;
  }

  render() {
    const descriptionRemainingChars =
      descriptionCharLimit - this.state.description.length;
    const titleRemainingChars = titleCharLimit - this.state.title.length;

    if (this.state.goingBack) {
      return <Navigate to="/" />;
    }

    return (
      <form
        onSubmit={this.handleSubmit}
        className="mx-auto flex max-w-3xl flex-col gap-4 ">
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
                  <SarRenderToPng ref={this.imageRef} sar={this.state.fileParsed} />
                </div>
                <div className="rounded-box flex flex-col gap-4 bg-base-100 py-4">

                  <TextInput
                    label="post name"
                    name="title"
                    value={this.state.title}
                    handleChange={this.handleChange}
                    required={true}
                    remainingCharacters={titleRemainingChars}
                    totalCharacters={titleCharLimit}
                    placeholder="enter name of post"
                    rules={`required, max ${titleCharLimit} characters`}
                  />

                  <TextInput
                    label="description"
                    name="description"
                    value={this.state.description}
                    handleChange={this.handleChange}
                    remainingCharacters={descriptionRemainingChars}
                    totalCharacters={descriptionCharLimit}
                    placeholder="enter description"
                    rules={`max ${descriptionCharLimit} characters`}
                  />

                  <TextInput
                    label="tags"
                    name="tags"
                    value={this.state.tags}
                    handleChange={this.handleChange}
                    placeholder="enter tags"
                    rules={`lowercase, split by commas, max ${tagCountLimit} tags, ${tagCharLimit} chars each`}
                  />

                </div>

                <div className="rounded-box flex justify-center bg-base-100 p-2">
                  <button type="submit" className="btn btn-success btn-block">
                    Submit
                  </button>
                </div>
                </>
              )
            : null
        }
      </form>
    );
  }
}
UploadPage.contextType = AppContext;

function TextInput(props) {
  const { remainingCharacters, totalCharacters } = props;
  return (
    <div className="form-control flex flex-col gap-3 px-4">
      <label className="flex items-center">
        <span className="text-xl font-semibold">{props.label}</span>
        {
          // prettier-ignore
          remainingCharacters !== undefined
            ? (
              <div
                className={`radial-progress radial-progress-label
                ${remainingCharacters ? 'text-success' : 'text-error'}`}
            style={{
              '--value': (remainingCharacters / totalCharacters) * 100
            }}>
            {remainingCharacters}
          </div>
              )
            : null
        }
      </label>
      <div>
        <input
          type="text"
          className="input h-fit w-full bg-base-300 p-2 leading-none"
          name={props.name}
          value={props.value}
          onChange={props.handleChange}
          required={props.required}
          placeholder={props.placeholder}
        />
        <label className="label">
          <span className="badge badge-ghost">{props.rules}</span>
        </label>
      </div>
    </div>
  );
}

function ErrorAlert(props) {
  const closeAlert = props.closeAlert;
  return (
    <div className="rounded-box flex items-center justify-between bg-error p-4 text-error-content">
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
