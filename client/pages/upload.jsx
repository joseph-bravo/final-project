import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SarRenderToPng from '../components/sar-renderer';
import processSarBuffer from '../lib/sar-parse';
import AppContext from '../lib/app-context';
import postSchema from '../../shared/post-schema';

const titleCharLimit = 25;
const descriptionCharLimit = 75;
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
      goingBack: false
    };

    this.imageRef = React.createRef();
    this.formRef = React.createRef();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fileLoad = this.fileLoad.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
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
      tags: ''
    });
  }

  componentWillUnmount() {
    window.removeEventListener('drop', this.handleDrop);
    window.removeEventListener('dragenter', this.cancelDefaults);
    window.removeEventListener('dragover', this.cancelDefaults);
  }

  handleSubmit(event) {
    event.preventDefault();
    const imageSrc = this.imageRef.current.state.imageSrc;
    toast.promise(
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
              'X-Access-Token': this.context.userToken
                ? this.context.userToken
                : ''
            }
          });
        })
        .then(res => res.json())
        .then(({ rows: [postDetails] }) => {
          this.resetForm();
          this.setState({ goingBack: true });
        })
        .catch(err => {
          console.error(err);
        }),
      {
        pending: 'Uploading...',
        success: 'Upload Complete!',
        error: 'Error Uploading File :('
      }
    );
  }

  handleFileChange(event) {
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

    toast.promise(
      file
        .arrayBuffer()
        .then(processSarBuffer)
        .then(fileParsed => {
          this.setState({ file, fileParsed });
        }),
      {
        error: `Unable to parse ${file.name}`
      }
    );
  }

  handleChange(event) {
    try {
      let { value } = event.target;
      value = value.trimStart();
      if (event.target.name === 'tags') {
        value = value.split(' ');
      }
      postSchema.validateSyncAt(event.target.name, {
        [event.target.name]: value
      });
    } catch (err) {
      if (err.type !== 'required') {
        return;
      }
    }
    this.setState({ [event.target.name]: event.target.value.trimStart() });
  }

  render() {
    const descriptionRemainingChars =
      descriptionCharLimit - this.state.description.trim().length;
    const titleRemainingChars = titleCharLimit - this.state.title.trim().length;

    if (this.state.goingBack) {
      return <Navigate to="/" />;
    }

    return (
      <form
        ref={this.formRef}
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
                    rules={`lowercase, split by spaces, max ${tagCountLimit} tags, ${tagCharLimit} chars each`}
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
