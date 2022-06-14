import React from 'react';
import { apiViewPostFromId } from '../lib/endpoints';
import DaisyModal from './daisy-modal';
import postSchema from '../../shared/post-schema';
import AppContext from '../lib/app-context';

const titleCharLimit = 25;
const descriptionCharLimit = 75;
const tagCharLimit = 10;
const tagCountLimit = 5;

export default class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      tags: '',
      previewImagePath: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.editing) {
      return;
    }
    const apiPath = apiViewPostFromId(this.props.editing);
    fetch(apiPath)
      .then(res => res.json())
      .then(res => {
        const { title, description, tags: rawTags, previewImagePath } = res;
        const tags = rawTags.join(' ');
        this.setState({ title, description, tags, previewImagePath });
      })
      .catch(() => this.context.setEditing(null));
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

    const { isOpen, closeModal } = this.props;
    const daisyProps = { label: 'Editing Post', isOpen, closeModal };

    const { previewImagePath } = this.state;

    return (
      <DaisyModal {...daisyProps}>
        <img
          className="rounded-box aspect-[2/1] w-full select-none"
          src={previewImagePath}
        />
        <div className="rounded-box my-8 flex flex-col gap-4 bg-base-100">
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
        <button className="btn btn-success btn-block" type="submit">
          update post
        </button>
      </DaisyModal>
    );
  }
}
EditModal.contextType = AppContext;

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
