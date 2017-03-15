import React, { Component, PropTypes } from 'react'
import { Layout } from 'antd'
import LayoutHeader from '../../components/layout-header'
import LayoutSider from '../../components/layout-sider'
import LayoutFooter from '../../components/layout-footer'
import './style.scss'

const { Header, Footer, Sider, Content } = Layout
const ipcRenderer = window.ipcRenderer

export default class CoreLayout extends Component {
  // 定义参数类型
  static propTypes = {
    openModal: PropTypes.func,
    location: PropTypes.object,
    noteBookList: PropTypes.array,
  }

  // 设置参数默认值
  static defaultProps = {
    openModal: () => null,
    location: null,
    noteBookList: [],
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

    
    ipcRenderer && ipcRenderer.on('logout', (evt, arg) => {
      //alert('logout')
      this.props.logout()
    })
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
      <Layout className={'core-layout'}>
        <LayoutHeader />
        <Layout>
          <Sider className="layout-sider">
            <LayoutSider
              noteBookList={this.props.noteBookList}
              location={this.props.location}
              openModal={this.props.openModal.bind(this)} />
          </Sider>
          {this.props.children}
        </Layout>
        {__DESKTOP__ ? <LayoutFooter /> : null}
      </Layout>
    )
  }
}