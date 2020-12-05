import React from 'react';
import './drop-menu.css';

class DropMenu extends React.Component {
  render() {
    return (
      <ul className='wrapper'>{this.props.children}</ul>
    )
  }
}

export class Item extends React.Component{
  render(){
    return(
      <li className='item' {...this.props}>{this.props.children}</li>
    )
  }
}
DropMenu.Item = Item;
export default DropMenu;