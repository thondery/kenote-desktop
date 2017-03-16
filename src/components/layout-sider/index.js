import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import { Menu, Dropdown } from 'antd'
import FontAwesome from '../font-awesome'
import './index.scss'

const { SubMenu } = Menu

export default class LayoutSider extends Component {
  // 定义参数类型
  static propTypes = {
    location: PropTypes.object,
    noteBookList: PropTypes.array,
    openModal: PropTypes.func,
    noteBookParams: PropTypes.string,
  }

  // 设置参数默认值
  static defaultProps = {
    location: null,
    noteBookList: [],
    openModal: () => null,
    noteBookParams: undefined,
  }

  // 组件初始化
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  // 组件在载入之前调用
  componentWillMount () {

  }

  // 组件在载入之后调用
  componentDidMount () {

  }

  // 当组件传入新参数时调用
  componentWillReceiveProps (nextProps) {

  }

  // 组件判断是否重新渲染时调用
  shouldComponentUpdate (nextProps, nextState) {
    return true
  }

  // 移除组件时调用
  componentWillUnmount () {
    
  }

  // 渲染组件
  render () {
    let { location, noteBookList, noteBookParams } = this.props

    let menu = (
      <Menu onClick={this.onMenuClick.bind(this)}>
        <Menu.Item key="1">配置</Menu.Item>
        <Menu.Item key="2">删除</Menu.Item>
      </Menu>
    )
    let pathname = location.pathname.match(/(^[//][\w\d]+)/i) || ['/']
    return (
      <div className="layout-sider-main">
        <Menu
          theme={'dark'}
          mode={'inline'}
          selectedKeys={[pathname[0]]}
          inlineIndent={10} >
          {__DESKTOP__ ? null : (
            <Menu.Item key={'/'}>
              <Link to={`/`}>
                <FontAwesome type={'home'} /><span>主页</span>
              </Link>
            </Menu.Item>
          )}
          <Menu.Item key={'/notes'}>
            <Link to={`/notes${noteBookParams ? `/${noteBookParams}` : ''}`}>
              <FontAwesome type={'file-text'} /><span>笔记</span>
            </Link>
          </Menu.Item>
          <Menu.Item key={'/notebook'}>
            <Link to={`/notebook`}>
              <FontAwesome type={'book'} /><span>笔记本</span>
            </Link>
          </Menu.Item>
          {/*<SubMenu key={'/notebook'}
            title={<span><FontAwesome type={'book'} /><span>笔记本</span></span>} >
            {noteBookList.map( (item, i) => {
              return <Menu.Item key={`/notebook/${item.clientId || item._id}`} >
                <Link to={`/notebook/${item.clientId || item._id}`}><span>{item.name}</span></Link>
                
                <Dropdown overlay={this.dropDownMenu(item)} trigger={['click']}>
                  <a><FontAwesome type={'cog'} /></a>
                </Dropdown>
              </Menu.Item>
            })}
          </SubMenu>*/}
          <Menu.Item key={'/tags'}>
            <Link to={`/tags`}>
              <FontAwesome type={'tags'} /><span>标签</span>
            </Link>
          </Menu.Item>
          <Menu.Item key={'/trash'}>
            <Link to={`/trash`}>
              <FontAwesome type={'trash'} /><span>废纸篓</span>
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    )
  }

  dropDownMenu (item) {
    return (
      <Menu onClick={this.onMenuClick.bind(this, item)}>
        <Menu.Item key="1">配置</Menu.Item>
        <Menu.Item key="2">删除</Menu.Item>
      </Menu>
    )
  }

  onMenuClick (item, e) {
    switch (e.key) {
      case '1':
        this.props.openModal('cogNotebook', item)
        break
      case '2':
        
        break
      default:
        break
    }
  }
}