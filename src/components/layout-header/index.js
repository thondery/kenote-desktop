import React, { Component, PropTypes } from 'react'
import { Layout, Icon, Menu, Dropdown, Tooltip, Input, Button } from 'antd'
import classnames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from '../../containers/reducer'
import WinTools from '../win-tools'
import FontAwesome from '../font-awesome'
import './index.scss'

const { Header } = Layout 
const { Search } = Input

class LayoutHeader extends Component {
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
    let { auth, syncPending } = this.props
    let menu = (
      <Menu onClick={this.onMenuClick.bind(this)}>
        <Menu.Item key="1">注销 {auth.username}</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="2">账户信息...</Menu.Item>
      </Menu>
    )
    return (
      <Header 
        className={classnames('layout-header', window.__MACOS__ && __DESKTOP__ ? null : 'layout-header-nomac')} 
        onDoubleClick={this.onDoubleClickHandle.bind(this)} >
        {window.__MACOS__ && __DESKTOP__ ? <div className="title">主页 — 基诺笔记</div> : null}
        {window.__MACOS__ && __DESKTOP__ ? <WinTools showMode={'all'} /> : null}
        <div className="layout-header-main">
          <div className="layout-header-left">
            <Dropdown overlay={menu} trigger={['click']}>
              <a className={'layout-header-auth'}>
                <FontAwesome type="user-o" />
                <span>{auth.username}</span>
                <FontAwesome type="angle-down" />
              </a>
            </Dropdown>
            {__DESKTOP__ ? 
              <Tooltip title={'与服务器同步'}>
                <a 
                  className={'layout-header-icon'} 
                  onClick={() => {
                    if (syncPending) return
                    this.props.actions.syncDataRequest()
                  }}>
                  <FontAwesome 
                    type="refresh" 
                    animated={syncPending ? 'spin' : undefined} />
                </a>
              </Tooltip>
             : null}
            <Tooltip title={'通知将会在此出现'}>
              <a className={'layout-header-icon'}>
                <FontAwesome type="bell-o" />
              </a>
            </Tooltip>
          </div>
          <div className="layout-header-right">
            <Tooltip title={'新建笔记'}>
              <Button icon="plus">新笔记</Button>
            </Tooltip>
            <Search
              className={'layout-header-searchbar'}
              placeholder="搜索笔记"
              style={{ width: 300 }}
              onSearch={value => {console.log(value)}} />
          </div>
        </div>
      </Header>
    )
  }

  onMenuClick (e) {
    switch (e.key) {
      case '1':
        this.props.actions.logoutMain()
        break
      case '2':
        this.props.actions.openModal('authInfo')
        break
      default:
        break
    }
  }

  onDoubleClickHandle (e) {
    window.__MACOS__ && window.maximize && window.maximize()
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  }
}

const mapStateToProps = (state) => ({
  auth                : state.Root.mainWindowAuth,
  syncPending         : state.Root.syncPending
})

export default connect(mapStateToProps, mapDispatchToProps)(LayoutHeader)