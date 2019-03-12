// @flow
import React, { Component } from 'react';
import { Alert, Spin, Layout, Form, Icon, Input, Button, Checkbox, Card } from 'antd';
import 'babel-polyfill';
import 'antd/dist/antd.css';
import storm from '../assets/lightning.svg';
const electron = window.require('electron');
const Cloudant = require('@cloudant/cloudant');
const { Meta } = Card;
const {
  Header, Content, Footer, Sider,
} = Layout;
const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;

class Login extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      account: null,
      username: null,
      databases: []
    }
  }
    
  componentDidMount() {
    this.setState({ loading: true });
    ipcRenderer.send('findCredentials', 'cumulonimbus');

    ipcRenderer.on('foundCredentials', (event, credentials) => {
      this.setState({ loading: false });
      if(credentials) {
        this.props.form.setFieldsValue(credentials);
        this.setState({ credentials });
      }
    })

    ipcRenderer.on('loggedIn', (event, response) => {
      this.setState({ loading: false });
      if(response.err) {
        return err.message;
      } else {
        const { databases, account, password } = response;
        if(this.state.remember) {
          ipcRenderer.send('setPassword', {
            service: 'cumulonimbus',
            account,
            password
          });
        }
        this.props.handleChange({ databases, loggedIn: true });
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { userName, password, remember } = values;
        this.login({ account: userName, password, remember });
      }
    });
  }

  login({ account, password, remember=false }) {
    this.setState({ loading: true, remember });
    ipcRenderer.send('login', { account, password });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Layout style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <Spin spinning={this.state.loading}>
            <Card
              hoverable
              style={{ width: '100%', textAlign: 'center' }}
              cover={<img src={storm}></img>}
              title="Login to Cloudant"
            >
              <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                <Form.Item>
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                  })(
                    <Input size="large" style={{ width: '100%' }} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                  })(
                    <Input size="large" style={{ width: '100%' }} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                  </Button><br/>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(
                    <Checkbox>Remember me</Checkbox>
                  )}
                </Form.Item>
              </Form>
            </Card>
          </Spin>
        </Content>
      </Layout>
    );
  }
}

export default Form.create({ name: 'Login' })(Login);
