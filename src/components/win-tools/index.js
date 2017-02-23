import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import './index.scss'

const ipcRenderer = window.ipcRenderer

export default class WinTools extends Component {
  // 定义参数类型
  static propTypes = {
    showMode: PropTypes.oneOf(['all', 'min'])
  }

  // 设置参数默认值
  static defaultProps = {
    showMode: 'all'
  }

  // 组件初始化
  constructor (props) {
    super(props)
    this.state = {
      blurStyle: null
    }
  }

  // 组件在载入之前调用
  componentWillMount () {
    ipcRenderer && ipcRenderer.on('blurWindow', (evt, arg) => {
      this.setState({ blurStyle: 'blur' })
    })
    ipcRenderer && ipcRenderer.on('focusWindow', (evt, arg) => {
      this.setState({ blurStyle: null })
    })
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
    let { showMode } = this.props
    let { blurStyle } = this.state
    return (
      <div className={classnames('win-tools', blurStyle)} >
        <a 
          className={showMode === 'min' ? 'tool-close-min' : 'tool-close'}
          onClick={this.winToolHandle.bind(this, showMode === 'min' ? 'quit' : 'close')} ></a>
        {showMode === 'all' ? 
          <a 
            className="tool-min"
            onClick={this.winToolHandle.bind(this, 'minimize')} ></a>
        : null}
        {showMode === 'all' ? 
          <a 
            className="tool-full"
            onClick={this.winToolHandle.bind(this, 'fullscreen')} ></a>
        : null}
      </div>
    )
  }

  winToolHandle (name) {
    window.winTools && window.winTools(name)
  }
}