import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import AppContext from '../lib/app-context';

export default class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isErrorAlertOpen: false,
      errorMessage: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.openAlert = this.openAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  componentDidMount() {
    this.setState({ navigateTo: null });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const { action } = this.props;
    switch (action) {
      case 'sign-up':
        fetch('/api/auth/sign-up', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        })
          .then(res => res.json())
          .then(res => {
            if (res.error === 'username already taken') {
              this.openAlert('Username is already taken.');
              return;
            }
            // eslint-disable-next-line no-console
            console.log('new user details', res);
            this.successfulRegister = true;
            this.clearForm();
          });
        break;
      case 'sign-in':
        break;
    }
  }

  clearForm() {
    this.setState({ username: '', password: '', isErrorAlertOpen: false });
  }

  openAlert(errorMessage) {
    this.setState({ isErrorAlertOpen: true, errorMessage });
  }

  closeAlert() {
    this.setState({ isErrorAlertOpen: false });
  }

  render() {
    if (this.successfulRegister) {
      this.successfulRegister = false;
      return <Navigate to="../sign-in" />;
    }

    const { action } = this.props;

    // prettier-ignore
    const headerText = action === 'sign-up'
      ? 'Register a new account'
      : 'Sign into an account';

    // prettier-ignore
    const primaryActionText = action === 'sign-up'
      ? 'Register'
      : 'Log In';

    // prettier-ignore
    const alternateActionText = action === 'sign-up'
      ? 'Sign in instead'
      : 'Register now';

    // prettier-ignore
    const alternateActionRoute =
      action === 'sign-up'
        ? '/auth/sign-in'
        : '/auth/sign-up';

    return (
      <form
        onSubmit={this.handleSubmit}
        className="mx-auto flex max-w-xl flex-col gap-4">
        <h2 className="rounded-box mx-auto w-fit bg-base-100 p-4 text-center text-2xl font-bold">
          {headerText}
        </h2>
        <div className="rounded-box flex flex-col gap-4 bg-base-100 py-4">
          <TextInput
            type="text"
            name="username"
            label="username"
            value={this.state.username}
            handleChange={this.handleChange}
            required={true}
            placeholder="enter username..."
          />
          <TextInput
            type="password"
            name="password"
            label="password"
            value={this.state.password}
            handleChange={this.handleChange}
            required={true}
            placeholder="enter password..."
          />
        </div>
        <div className="rounded-box flex gap-4 bg-base-100 p-2">
          <Link to={alternateActionRoute} className="btn btn-info flex-[1]">
            {alternateActionText}
          </Link>
          <button type="submit" className="btn btn-success flex-[3]">
            {primaryActionText}
          </button>
        </div>
        {
          // prettier-ignore
          this.state.isErrorAlertOpen
            ? <ErrorAlert errorMessage={this.state.errorMessage} closeAlert={this.closeAlert} />
            : null
        }
      </form>
    );
  }
}
AuthPage.contextType = AppContext;

function TextInput(props) {
  const { label, type, name, value, handleChange, required, placeholder } =
    props;

  return (
    <div className="form-control flex flex-col gap-3 px-4">
      <label className="flex items-center">
        <span className="text-xl font-semibold">{label}</span>
      </label>
      <div>
        <input
          type={type}
          className="input h-fit w-full bg-base-300 p-2 leading-none"
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function ErrorAlert(props) {
  const { closeAlert, errorMessage } = props;
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
        <h4>{errorMessage}</h4>
      </div>

      <div className="flex-none">
        <button className="btn btn-ghost" onClick={closeAlert}>
          <span className="material-icons">close</span>
        </button>
      </div>
    </div>
  );
}
