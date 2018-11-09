import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';

const renderMenuItem = item => ( // item.route 菜单单独跳转的路由
  <Menu.Item
    key={item.key}
  >
    <div>
      {item.icon && <Icon type={item.icon} />}
      <span className="nav-text">{item.title}</span>
    </div>
  </Menu.Item>
);

const renderSubMenu = item => (
  <Menu.SubMenu
    key={item.key}
    title={
      <span>
        {item.icon && <Icon type={item.icon} />}
        <span className="nav-text">{item.title}</span>
      </span>
        }
  >
    {item.subs.map(item => renderMenuItem(item))}
  </Menu.SubMenu>
);

export default ({ menus, ...props }) => (
  <Menu {...props}>
    {menus && menus.map(item =>
      item.subs ? renderSubMenu(item) : renderMenuItem(item)
    )}
  </Menu>
);
