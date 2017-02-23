import React, { Component, PropTypes } from 'react'
import FontAwesome from '../font-awesome'
import './index.scss'
import Logo from '../../assets/images/kenote.svg'

export default class LoadingPage extends Component {
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
    window.reload && window.reload('PAGE_INIT_ARGS')
  }

  // 组件在载入之后调用
  componentDidMount () {

  }

  // 当组件传入新参数时调用
  componentWillReceiveProps (nextProps) {

  }

  // 组件判断是否重新渲染时调用
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }

  // 移除组件时调用
  componentWillUnmount () {
    
  }

  // 渲染组件
  render () {
    return (
      <div className="loading-page animated fadeIn">
        <img src={Logo} />
        <FontAwesome 
          className={'icon'} 
          type={'spinner'} 
          animated={'spin'} 
          larger={'4x'} />
      </div>
    )
  }
}