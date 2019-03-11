import React, { Component } from 'react';
import { Alert, Spin } from 'antd';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import Cloudant from '@cloudant/cloudant';
import 'antd/dist/antd.css';


class Home extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loggedIn: false,
      user: {},
      databases: []
    }
  }
  
  update(nextState) {
    this.setState(nextState);
  }

  render() {
    switch(this.state.loggedIn) {
      case true:
        return <Dashboard
                databases={this.state.databases}
                />
      case false:
        return <Login handleChange={this.update.bind(this)} />
    }
  }
}

export default Home;
