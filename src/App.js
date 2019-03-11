import React, { Component } from 'react';
import Home from './components/Home';
import { Layout } from 'antd';
import 'antd/dist/antd.css';

const {
  Header, Content, Footer, Sider,
} = Layout;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff', textAlign: 'left' }}>
              <Home />
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
