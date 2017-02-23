import React, { Component, PropTypes } from 'react'
import { Menu } from 'antd'
import FontAwesome from '../font-awesome'
import './index.scss'

const { SubMenu } = Menu

export default class LayoutSider extends Component {
  // 定义参数类型
  static propTypes = {

  }

  // 设置参数默认值
  static defaultProps = {

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
    return (
      <div className="layout-sider-main">
        <Menu
          theme={'dark'}
          mode={'inline'}
          inlineIndent={10}
          >
          <Menu.Item key={'1'}>
            <FontAwesome type={'file-text'} /><span>笔记</span>
          </Menu.Item>
          <SubMenu key={'sub-1'}
            title={<span><FontAwesome type={'book'} /><span>笔记本</span></span>} >
            <Menu.Item key={'sub-1-1'}>
              <span>笔记本1</span>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key={'3'}>
            <FontAwesome type={'tags'} /><span>标签</span>
          </Menu.Item>
          <Menu.Item key={'4'}>
            <FontAwesome type={'trash'} /><span>废纸篓</span>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}