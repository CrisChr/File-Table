/**
 * 网盘文件管理组件：
 *  1、按钮组操作、搜索
 *  2、面包屑导航组件（BreadNav） ，前进和后退
 *  3、单条数据列表操作
 *  4、文件类型匹配图标
 *  5、列表排序：sort默认为false不排序
 *
 *  @columns 要展示的列（数组类型）：
 *    title: 列名称（字符串，必须）
 *    key: 列键值 （字符串或整型，必须）
 *    width：列宽，（字符串或整型，默认200）
 *    sort：是否列排序 （true或false，必须）
 *    component：自定义列组件 （ReactNode类型）
 *
 *  @rowKey 同Ant Table，表格行 key 的取值，可以是字符串或一个函数
 *
 *  @handleBtn 按钮组 （数组类型）
 *    key: 按钮key（字符串或整型，必须）
 *    name: 按钮要显示的名称 （字符串，必须）
 *    type：按钮类型，同Ant Button，默认为primary
 *    relation：按钮生效方式，默认none
 *      none：一直生效
 *      single: 单选生效
 *      multiple：多选生效
 *      icon：按钮图标，默认Ant Icon，可自定义，为ReactNode类型
 *
 *  @search 是否显示搜索框，默认为true
 *
 *  @dataSource 数据源，异步函数类型，需后端接口返回
 *
 *  @btnCallback 按钮组回调函数，必须包含以下参数：
 *    key： 按钮key
 *    selectedRows：选中的列表项（数组类型）
 *    currentPath：当前文件路径
 *    callback：操作后的回调函数
 *
 */

import React from "react";
import {Table, Row, Button, Dropdown, Menu, Input} from "antd";
import BreadNav from "./bread-crumb/bread-nav";
import {formatBytes} from '../../common-function/common';
import "./file-table.less";

const btnStyle = {
  margin: "0 10px 5px 0"
};

export default class FileTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], // 选择的文件key集合
      selectedRows: [], // 选择的文件集合
      path: [],  // 路径集合
      files: [], // 文件列表集合
      showOperate: false, // 默认不直接展示操作列，鼠标移上去后显示
      currentId: "", // 鼠标移上去时当前项ID
    }
  }
  render() {
    const {columns, rowKey = "", handleBtn, search = true} = this.props;
    const {selectedRowKeys, path, files} = this.state;
    return (
      <div>
        <BreadNav callback={this.handleClickPath} path={path}/>
        <Row>
          {
            !!handleBtn.length && handleBtn.map(btn => {
              if (btn.children && !!btn.children.length) {
                const menu = (
                  <Menu>
                    {
                      btn.children.map(child => {
                        return <Menu.Item key={child.key} onClick={() => this.onClick(child.key)} >
                          {child.name}
                        </Menu.Item>
                      })
                    }
                  </Menu>
                )
                return <Dropdown disabled={this.isDisabled(btn.relation)} overlay={menu} key={btn.key}>
                  <Button style={btnStyle} type={btn.type || "default"} icon={<btn.icon/> || ""}>
                    {btn.name}
                  </Button>
                </Dropdown>
              }
              return <Button disabled={this.isDisabled(btn.relation)} onClick={() => this.onClick(btn.key)}
                style={btnStyle} type={btn.type || "default"} key={btn.key} icon={<btn.icon/> || ""}>
                {btn.name}
              </Button>
            })
          }
          {
            search &&
            <Input.Search placeholder="搜索文件或文件夹" style={{width: "220px"}}
              onSearch={(value, e) => this.handleSearch(value, e)} allowClear />
          }
        </Row>
        <Table style={{marginTop: "10px"}} rowKey={rowKey} dataSource={files} scroll={files.length > 10 ? {y: 600} : false}
          locale={{
            emptyText: <div className="file-empty"></div>,
          }}
          pagination={false}
          rowSelection={{selectedRowKeys, onChange: (selectedRowKeys, selectedRows) => this.setState({selectedRowKeys, selectedRows})}}
          onRow={record => {
            return {
              onMouseOver: e => { // 鼠标移上去时
                this.setState({showOperate: true, currentId: record.id});
              },
              onMouseLeave: e => { // 鼠标移出时
                this.setState({showOperate: false});
              },
            }
          }}
        >
          {
            this.filterColumns(columns)
          }
        </Table>
      </div>
    )
  }

  componentDidMount() {
    this.getDataSource();
  }

  //  卸载组件，防止切换路由时异步操作未停止所导致的state改变
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    }
  }

  // 搜索回调
  handleSearch = (value, e) => {
    const currentPath = !!this.state.path.length ? this.state.path[this.state.path.length - 1] : "";
    this.props.dataSource({parentDirId: (currentPath || {}).parentDirId || "", name: value, groupId: this.props.groupId}).then(res => {
      this.setState({files: res.data});
    })
  }

  // 按钮组点击回调
  onClick = key => {
    const {selectedRows, path} = this.state;
    const currentPath = !!path.length ? path[path.length - 1] : "";
    this.props.btnCallback(key, selectedRows, currentPath, () => { this.getDataSource((currentPath || {}).parentDirId, (currentPath || {}).name, path, "back", this.props.type) });
  }

  /**
   * @parentDirId: 父目录ID
   * @name: 名称
   * @path: 当前路径，数组类型
   * @pathType: 导航方式，前进（forward）：点击文件夹进入子目录；后退（back）：点击面包屑导航退回到上一目录
   * @type: user——用户文件，group——群组文件
   */
  getDataSource = (parentDirId = "", name = "", path, pathType = "forward", type = this.props.type) => {
    // 如果是群组文件列表，需传入群组ID
    const params = type === "user" ? {parentDirId, name: ""} : {parentDirId, name: "", groupId: this.props.groupId};

    (this.props.dataSource instanceof Object) ? this.props.dataSource(params).then(res => {
      this.setState({files: res.data});
      if (pathType === "forward" && parentDirId !== "") { // 点击文件夹更新
        this.setState(prevState => ({
          path: [...prevState.path, {parentDirId, name}]
        }))
      } else if (pathType === "back") { // 点击导航路径更新
        this.setState({path});
      }
      this.setState({selectedRowKeys: []}); // 每次更新列表都要清空选中的item，不保留上次勾选项
    }) : this.setState({files: []});
  }

  // 点击导航事件回调
  handleClickPath = (e, index) => {
    const {path} = this.state;
    const nIndex = index + 1;
    const newPath = [...path].slice(0, nIndex);
    if (index === -1)++index; // 如果是跟路径
    this.getDataSource((newPath[index] || {}).parentDirId, (newPath[index] || {}).name, newPath, "back", this.props.type);
  }

  isDisabled = relation => {
    const {selectedRowKeys} = this.state;
    if (relation === "single") {
      return selectedRowKeys.length !== 1;
    } else if (relation === "multiple") {
      return selectedRowKeys.length === 0;
    } else {
      return false;
    }
  }

  // 排序（文件名、文件大小、更新时间）
  handleSort = (prev, next, key) => {
    switch (key) {
      case "fileSize":
        return prev[key] - next[key];
      case "updateTime":
        return new Date(prev[key]).getTime() - new Date(next[key]).getTime();
      case "name":
        return prev[key].localeCompare(next[key]);
      default:
        break;
    }
  }

  // 过滤列：文件夹可点击，文件不能点击
  filterColumns = columns => {
    return columns.map(item => {
      return <Table.Column width={item.width || 'undefined'}
        title={item.title}
        key={item.key}
        sorter={item.sort ? (a, b) => this.handleSort(a, b, item.key) : false}
        sortDirections={"ascend" | "descend"}
        onCell={() => {
          return {
            style: {
              whiteSpace: "nowrap",
              width: item.width || 200,
              maxWidth: 200,
            }
          }
        }}
        render={record => {
          const Content = item.component;
          const {path, showOperate, currentId} = this.state;
          const currentPath = !!path.length ? path[path.length - 1] : "";
          const width = parseFloat(Math.floor(item.width / 2)) + "px";
          if (item.key === "name") {
            return (
              <div className="list-container">
                {
                  record.dirType === "DIR" ?
                  <div style={{width}}>
                    <i className="files_type folder" />
                    <span key={item.key} title={record[item.key]}className="ellipsis folder_container"
                      onClick={() => this.getDataSource(record.id, record.name, this.state.path, "forward", this.props.type)}
                    >
                    {record[item.key]}
                    </span>
                  </div>
                  :
                  <div style={{width}}>
                    <i className='files_type'/>
                    <span key={item.key} title={record[item.key]} className="ellipsis file-container">
                      {record[item.key]}
                    </span>
                  </div>
                }
                {showOperate && currentId === record.id && Content && <Content data={record} currentPath={currentPath}
                  getList={() => this.getDataSource(currentPath.parentDirId, currentPath.name, path, "back", this.props.type)} />}
              </div>)
          } else if (item.key === "fileSize") {
            return <span>{record.dirType !== "DIR" && formatBytes(record[item.key])}</span>
          } else {
            return Content ?
              <Content data={record} currentPath={currentPath}
                getList={() => this.getDataSource(currentPath.parentDirId, currentPath.name, path, "back", this.props.type)} />
              : <span>{record[item.key]}</span>
          }
        }}
      />
    })
  }
}