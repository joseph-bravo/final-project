import React from 'react';
import AppContext from '../lib/app-context';

export default class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  render() {
    const { action } = this.props;
    return <div>Hello World {action}!</div>;
  }
}
AuthPage.contextType = AppContext;
