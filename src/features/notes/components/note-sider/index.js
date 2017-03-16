import React, { Component, PropTypes } from 'react'
import { Layout, Select, Input } from 'antd'
import './index.scss'

const { Header } = Layout
const { Option } = Select

export default class NoteSider extends Component {
  // 定义参数类型
  static propTypes = {
    noteBookList: PropTypes.array,
    noteBook: PropTypes.string,
    onPushChange: PropTypes.func,
  }

  // 设置参数默认值
  static defaultProps = {
    noteBookList: [],
    noteBook: undefined,
    onPushChange: () => null,
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
    let { noteBookList, noteBook, onPushChange } = this.props
    return (
      <Layout className={'notes-sider-main'}>
        <Header className={'notes-sider-header'}>
          <Select 
            defaultValue={noteBook ? noteBook : 'all'} 
            onChange={onPushChange}
            style={{ width: 280 }}>
            <Option value="all">全部笔记</Option>
            {noteBookList.map( (item, i) => {
              return (
                <Option key={i} value={item.clientId || item._id}>{item.name}</Option>
              )
            })}
          </Select>
        </Header>
      </Layout>
    )
  }
}