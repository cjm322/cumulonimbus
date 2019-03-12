import React, { Component } from 'react';
import { Table, Divider, Tag } from 'antd';

const { Column } = Table;

class DocumentsTable extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    }
  }
  
  render() {
    return (
      <Table dataSource={this.props.data}>
        <Column
          title="Id"
          dataIndex="id"
          key="id"
        />
        <Column
          title="Key"
          dataIndex="key"
          key="key"
        />
        <Column
          title="Value"
          dataIndex="value.rev"
          key="value"
        />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <span>
              <a href="javascript:;">Invite </a>
              <Divider type="vertical" />
              <a href="javascript:;">Delete</a>
            </span>
          )}
        />
      </Table>
    )
  }
}

export default DocumentsTable;
