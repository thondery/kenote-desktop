import React, { Component, PropTypes } from 'react'
import { Layout, message } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from '../../containers/reducer'
import { getNoteBookList } from '../../features/notebook/action'
import * as notebookService from '../../proxys/notebook'
import * as deleteService from '../../proxys/delete'
import * as syncdataService from '../../proxys/syncdata'
import { getAuth } from '../../services/token'
import './index.scss'

const { Footer } = Layout

class LayoutFooter extends Component {
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
    let { syncPending, syncError, syncProgress, syncPullData, syncTempData, syncPushReslut } = nextProps
    if (syncError) {
      message.error('与服务器同步出错，请稍后再试！')
    }
    if (syncPending) {
      let user = getAuth()
      switch (syncProgress) {
        case 'pull:after':
          this.props.actions.syncTempDataSave()
          break
        case 'temp:after':
          this.props.actions.syncMergeData('begin')
        case 'merge:bengin':
          let _notebook = null
          if (syncPullData.type === 'increase') {
            _notebook = syncPullData.notebook.result
          }
          else {
            _notebook = syncPullData.notebook
          }
          _notebook = _notebook ? _notebook : []
          return notebookService.mergeNotebookList(_notebook, user)
            .then( doc => {
              if (syncPullData.notebook && syncPullData.notebook.delete) {
                return notebookService.remove({ serverId: { $in: syncPullData.notebook.delete }}, { multi: true })
              }
              else {
                return null
              }
            })
            .then( () => {
              this.props.actions.syncMergeData('success')
            })
          break
        case 'merge:after':
          this.props.actions.syncDataSend(syncTempData)
          break
        case 'push:after':
          let { updateCount, fullSyncBefore, notebook } = syncPushReslut
          return notebookService.pushUpdateNotebookList(notebook, user)
            .then( doc => {
              this.props.actions.getNoteBookList()
              return doc
            })
            .then( doc => {
              return deleteService.remove({}, { multi: true })
            })
            .then( doc => {
              return syncdataService.setInfo(user, updateCount, fullSyncBefore)
            })
            .then( doc => {
              message.success('与服务器同步完成！')
              this.props.actions.syncDataAllEnd(updateCount, fullSyncBefore)
            })
          break
        default:
          
          break
      }
    }

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
    let { syncProgress, syncPullData, syncTempData } = this.props
    return (
      <Footer className={'layout-footer'}>Footer => {syncProgress}</Footer>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions, getNoteBookList }, dispatch)
  }
}

const mapStateToProps = (state) => ({
  syncPending         : state.Root.syncPending,
  syncPullData        : state.Root.syncPullData,
  syncProgress        : state.Root.syncProgress,
  syncError           : state.Root.syncError,
  syncTempData        : state.Root.syncTempData,
  syncPushReslut      : state.Root.syncPushReslut
})

export default connect(mapStateToProps, mapDispatchToProps)(LayoutFooter)