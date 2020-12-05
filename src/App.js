import React from 'react';
import {Tooltip, Dropdown} from 'antd';
import {
  ShareAltOutlined, PaperClipOutlined, DownloadOutlined,
  EllipsisOutlined, PlusOutlined, CloudUploadOutlined,
  CloudDownloadOutlined, DeleteOutlined, CopyOutlined,
  DragOutlined, ReloadOutlined
} from '@ant-design/icons';
import FileTable from './components/f-table/file-table';
import DropMenu from './components/drop-menu';

const btnList = [
  {key: 'add', name: '新建', type: 'primary', relation: 'none', icon: () => <PlusOutlined/>},
  {key: 'upload', name: '上传', relation: 'none', icon: () => <CloudUploadOutlined />, children: [
    {key: 'uploadFile', name: '上传文件'},
    {key: 'uploadFolder', name: '上传文件夹'}
  ]},
  {key: 'download', name: '下载', relation: 'multiple', icon: () => <CloudDownloadOutlined />},
  {key: 'delete', name: '删除', type: 'danger', relation: 'multiple', icon: () => <DeleteOutlined />},
  {key: 'share', name: '分享', icon: () => <ShareAltOutlined/>, relation: 'multiple', children: [
    {key: 'diskShare', name: '云盘分享'},
    {key: 'linkShare', name: '链接分享'}
  ]},
  {key: 'copy', name: '复制', relation: 'multiple', icon: () => <CopyOutlined />},
  {key: 'move', name: '移动', relation: 'multiple', icon: () => <DragOutlined />},
  {key: 'refresh', name: '刷新', icon: () => <ReloadOutlined />}
]

class App extends React.Component {
  render(){
    return (
      <div style={{padding: '80px'}}>
        <FileTable
          search={true}
          handleBtn={btnList}
          columns={[
            {title: '名称', key: 'name', sort: true, width: 400, component: ({data, currentPath, getList}) => (
              <div>
                <Tooltip title='云盘分享'>
                  <ShareAltOutlined onClick={() => this.diskShare([data])}/>
                </Tooltip>
                <Tooltip title='链接分享'>
                  <PaperClipOutlined onClick={() => this.linkShare([data])}/>
                </Tooltip>
                <Tooltip title='下载'>
                  <DownloadOutlined onClick={() => this.download([data])}/>
                </Tooltip>
                <Dropdown overlay={
                  <DropMenu>
                    <DropMenu.Item onClick={() => this.copyFile(currentPath, [data], getList)}>复制</DropMenu.Item>
                    <DropMenu.Item onClick={() => this.moveFile(currentPath, [data], getList)}>移动</DropMenu.Item>
                    <DropMenu.Item onClick={() => this.edit(data, getList)}>编辑</DropMenu.Item>
                    <DropMenu.Item onClick={() => this.delete(currentPath, [data], getList)}>删除</DropMenu.Item>
                  </DropMenu>}
                  >
                  <EllipsisOutlined />
                </Dropdown>

              </div>
            )},
            {title: '大小', key: 'fileSize', sort: true},
            {title: '更新时间', key: 'updateTime', sort: true},
            {title: '上传者', key: 'createBy'}
          ]}
          rowKey='id'
          dataSource={this.getDataSource}
          btnCallback={this.handleBtnCallback}
        />
      </div>
    );
  }

  /**
   * 获取数据源
   * @param {*} data 封装的查询参数，即搜索框内输入的文件名
   */
  getDataSource(data){
    /**
     * 这里可直接调用后段接口返回数据，需要注意的是：
     * 1. 必须为异步调用
     * 2. 返回的数据必须包含以下几个字段，其余字段可根据项目实际情况设置：
     *  @id 文件或文件夹唯一标识
     *  @dirType 文件类型，如果是文件夹，值为DIR，如果是文件，则为FILE
     *  @name 文件或文件夹名称
     *  @fileSize 文件大小，文件夹默认为null
     */
    return new Promise((resolve, reject) => {

    });
  }

  /**
   * 按钮组事件
   * @param {*} key 按钮key
   * @param {*} selectedRows 选中的列表项
   * @param {*} currentPath  当前文件路径
   * @param {*} callback 操作后的回调函数
   */
  handleBtnCallback(key, selectedRows, currentPath, callback){
    switch(key){
      case 'refresh':{
        // 这里是刷新的方法
        break;
      }
      case 'add':{
        // 这里是新建文件夹的方法
        break;
      }
      case 'uploadFile':{
        // 这里是上传文件的方法
        break;
      }
      case 'uploadFolder':{
        // 这里是上传文件夹的方法
        break;
      }
      case 'download':{
        // 这里是下载的方法
        break;
      }
      case 'delete':{
        // 这里是删除文件的方法
        break;
      }
      case 'diskShare':{
        // 这里是网盘分险的方法
        break;
      }
      case 'linkShare':{
        // 这里是链接分享的方法
        break;
      }
      case 'copy':{
        // 这里是复制文件的方法
        break;
      }
      case 'move':{
        // 这里是移动文件的方法
        break;
      }
      default:
        break;
    }
  }
}

export default App;
