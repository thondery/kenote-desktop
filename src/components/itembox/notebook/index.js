import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import './index.scss'
import FontAwesome from '../../font-awesome'

export default class Notebook extends Component {
  // 定义参数类型
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string,
    }),
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    onCogNotebook: PropTypes.func,
    onTrashNotebook: PropTypes.func,
    onDoubleClick: PropTypes.func,
  }

  // 设置参数默认值
  static defaultProps = {
    data: null,
    onClick: () => null,
    selected: false,
    onCogNotebook: () => null,
    onTrashNotebook: () => null,
    onDoubleClick: () => null,
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
    let { data, onClick, selected, onCogNotebook, onTrashNotebook, onDoubleClick } = this.props
    let classname = classnames(
      'notebook-list-item', 
      selected ? 'notebook-list-item-selected' : undefined,
      'animated fadeInLeft'
    )
    return (
      <div className={classname} 
        onClick={onClick}
        onDoubleClick={onDoubleClick} >
        <div className={'notebook-list-item-name'}>
          <span>{data.name}</span>
        </div>
        <span>15 笔记</span>
        <div className={'notebook-list-item-tools'}>
          <FontAwesome 
            type="trash" 
            style={{ color: '#999' }} 
            onClick={onTrashNotebook} />
          <FontAwesome 
            type="cog" 
            style={{ color: '#999' }} 
            onClick={onCogNotebook} />
        </div>
      </div>
    )
  }
}