# File Table

```
npm install
npm start
```
## 功能
* 支持多级文件夹导航
* 支持列排序
* 支持搜索
* 支持选择行（单选和多选后批量操作）
* 支持文件大小自动换算
* 支持新建文件夹、上传文件（夹）、删除文件（夹）、分享文件（夹），包括网盘分享和链接分享、复制文件（夹）、移动文件（夹）、刷新。如需更多操作，可在handleBtn属性内自定义，并在btnCallback函数内实现。

***以上功能，除排序、文件大小换算和选择行外，其余都需要后端接口支持，
文件图标可根据返回的文件后缀自行用图片匹配***

## 相关属性说明

```
@columns 要展示的列（数组类型）：
  title: 列名称（字符串，必须）
  key: 列键值 （字符串或整型，必须）
  width：列宽，（字符串或整型，默认200）
  sort：是否列排序 （true或false，必须）
  component：自定义列组件 （ReactNode类型）

@rowKey 同Ant Table，表格行 key 的取值，可以是字符串或一个函数

@handleBtn 按钮组 （数组类型）
  key: 按钮key（字符串或整型，必须）
  name: 按钮要显示的名称 （字符串，必须）
  type：按钮类型，同Ant Button，默认为primary
  relation：按钮生效方式，默认none
    none：一直生效
    single: 单选生效
    multiple：多选生效
    icon：按钮图标，默认Ant Icon，可自定义，为ReactNode类型

@search 是否显示搜索框，默认为true

@dataSource 数据源，异步函数类型，需后端接口返回

@btnCallback 按钮组回调函数，必须包含以下参数：
  key：按钮key
  selectedRows：选中的列表项（数组类型）
  currentPath：当前文件路径，字符串类型
  callback：操作后的回调函数
 ```

 ![File Table component show case](/public/File Table.jpg)