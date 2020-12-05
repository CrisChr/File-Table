import React from "react";
import {Breadcrumb, Button} from "antd";
import "../file-table.less";

export default class BreadcrumbText extends React.Component {
  render() {
    const {path, handleClickPath, rootTitle} = this.props;
    const rootPath = <Breadcrumb.Item>
      <Button type="link" className="breadcrump-btn" onClick={e => handleClickPath(e, -1, path)}>
        {rootTitle}
      </Button>
    </Breadcrumb.Item>;
    const directories = path && path.map((dir, index) => {
      return <Breadcrumb.Item key={index}>
        <Button type="link" className="breadcrump-btn" onClick = { e => handleClickPath(e, index, path)}>
          <span className="ellipsis" title={dir.name} style={{maxWidth: "200px", lineHeight: 1.3}}>{dir.name}</span>
        </Button>
      </Breadcrumb.Item>
    });
    return (
      <div style={{marginBottom: "10px"}}>
        <Breadcrumb separator=">">
          {rootPath}
          {directories}
        </Breadcrumb>
      </div>
    )
  }
}