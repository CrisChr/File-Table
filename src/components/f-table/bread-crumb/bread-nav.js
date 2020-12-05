/**
 * @path 文件（夹）路径
 * @rootTitle 根路径名
 * @handleClickPath 点击路径的回调
 */

import React from "react";
import  BreadcrumbText from "./bread-crumb-text";

export default class BreadNav extends React.Component{
  render(){
    const {path} = this.props
    return(
      <BreadcrumbText
        path={path}
        rootTitle="> 全部文件"
        handleClickPath={this.handleClickPath}
      />
    )
  }

  handleClickPath=(e, index) => {
    this.props.callback(e, index);
  }
}