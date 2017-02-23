import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import 'font-awesome/css/font-awesome.css'

export default class FontAwesome extends Component {
  // 定义参数类型
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.string.isRequired,
    larger: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
    animated: PropTypes.oneOf([undefined, 'spin', 'pulse']),
    rotated: PropTypes.oneOf([0, 90, 180, 270]),
    style: PropTypes.object,
    onClick: PropTypes.func
  }

  // 设置参数默认值
  static defaultProps = {
    className: undefined,
    larger: 'lg',
    animated: undefined,
    rotated: 0,
    style: null,
    onClick: null
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
    let { className, type, larger, animated, style, rotated, onClick } = this.props
    let classname = classnames(
      'fa', 
      `fa-${type}`, 
      `fa-${larger}`,
      animated ? `fa-${animated}` : undefined,
      rotated > 0 ? `fa-rotate-${rotated}` : undefined,
      className)
    let opts = {
      style,
      onClick
    }
    return (
      <i {...opts}
        className={classname} 
        aria-hidden={true} />
    )
  }
}