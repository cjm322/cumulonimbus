import React, { Component } from 'react';
import {
  Layout, Menu, Breadcrumb, Icon,
} from 'antd';
import { Card, Alert, Spin } from 'antd';
import Cloudant from '@cloudant/cloudant';
import 'antd/dist/antd.css';
const electron = window.require('electron');

const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const { Header, Content, Sider } = Layout;

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      loggedIn: false,
      database: '',
      document: {},
      documents: [],
      openKeys: ['database']
    }
  }

  componentDidMount() {
    ipcRenderer.on('documentsFetched', (event, documents) => {
      this.setState({ documents, loading: false });

    })

    ipcRenderer.on('documentFetched', (event, document) => {
      this.setState({ document, loading: false });

    })

    ipcRenderer.on('cloudantError', (event, response) => {
      this.setState({ database, loading: false });
      console.log(response);
    })
  }

  setDatabase(database) {
    this.setState({ database, loading: true });
    ipcRenderer.send('fetchDocuments', database);
  }

  fetchDocument(id) {
    this.setState({ loading: true });
    const { database } = this.state;
    ipcRenderer.send('fetchDocument', { database, id });
  }

  onOpenChange(openKeys) {
    let _openKeys = [openKeys[0], openKeys[1]]
    if(openKeys.length > 2) {
      _openKeys = [openKeys[0], openKeys[2]]
    }
    const db = _openKeys[1];
    this.setState({ openKeys: _openKeys })
    this.setDatabase(db);
    
  }

  render() {
    return(
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['database']}
            style={{ height: '100%', borderRight: 0 }}
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange.bind(this)}
          >
            <SubMenu key="database" title={<span><Icon type="database" />Databases</span>}>
              {this.props.databases.map(database => (
                <SubMenu
                  key={database}
                  title={database}
                >
                  {this.state.documents.map(document => (
                    <Menu.Item
                      key={document.id}
                      onClick={() => {
                        this.fetchDocument(document.id);
                      }}
                    >
                    {document.id}
                  </Menu.Item>
                  ))}
                </SubMenu>
              ))}
            </SubMenu>
          </Menu>
        </Sider>
        <Spin spinning={this.state.loading}>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>{this.state.database}</Breadcrumb.Item>
            </Breadcrumb>
            <Content style={{
              background: '#fff', padding: 24, margin: 0, minHeight: 280,
            }}
            >
              {JSON.stringify(this.state.document)}
            </Content>
          </Layout>
        </Spin>
      </Layout>
    )
  }
}

export default Dashboard;
