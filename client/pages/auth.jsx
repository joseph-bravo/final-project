import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppContext from '../lib/app-context';

export default class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
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
        toast.promise(
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
                throw new Error('Username is already taken...');
              }
              this.successfulRegister = true;
              this.clearForm();
            }),
          {
            error: {
              render({ data }) {
                return data.message;
              }
            }
          }
        );
        break;
      case 'sign-in':
        toast.promise(
          fetch('/api/auth/sign-in', {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          })
            .then(res => res.json())
            .then(res => {
              if (res.error === 'invalid login') {
                throw new Error('Invalid Login...');
              }
              this.context.login(res.token);
              this.successfulSignup = true;
              return res.user.username;
            }),
          {
            pending: 'Logging in...',
            success: {
              render({ data }) {
                return `Hello, ${data}!`;
              }
            },
            error: {
              render({ data }) {
                return data.message;
              }
            }
          }
        );
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

    if (this.successfulSignup) {
      this.successfulSignup = false;
      return <Navigate to="/" />;
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
