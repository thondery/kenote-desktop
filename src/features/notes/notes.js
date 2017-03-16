import React, { Component, PropTypes } from 'react'
import { Layout, Button } from 'antd'
import NoteSider from './components/note-sider'
import './style.scss'

const { Sider, Content } = Layout

export default class Notes extends Component {
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
    let { params } = this.props
    let { notebook } = params
    console.log(notebook)
    notebook && this.props.actions.changeParams(notebook)
  }

  // 当组件传入新参数时调用
  componentWillReceiveProps (nextProps) {
    console.log('进入')
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
    let { noteBookList, params, currentNote } = this.props
    let { notebook } = params
    return (
      <Layout style={{ background: '#f7f7f7' }}>
        <Sider width={300}>
          <NoteSider noteBookList={noteBookList} noteBook={notebook} onPushChange={this.onPushChangeHandle.bind(this)} />
        </Sider>
        <Content>
          {currentNote ? (
            <div />
          ) : (
            <div className={'notes-content-none'}>
              空空如也，不如
              <Button icon="plus" size="large">新建笔记</Button>
            </div>
          )}
        </Content>
      </Layout>
    )
  }

  onPushChangeHandle (value) {
    let { router } = this.props
    router.push(`/notes${value === 'all' ? '' : `/${value}`}`)
    this.props.actions.changeParams(value)
    
  }
}