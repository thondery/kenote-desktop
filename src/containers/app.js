import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from './reducer'
import LoadingPage from '../components/loading-page'
import LoginPage from '../components/login-page'
import 'font-awesome/css/font-awesome.css'
import '../styles/core.scss'
import CoreLayout from '../layouts/core'
import Modal from '../components/modal'
import { rootNoteBookList } from '../features/notebook/action'
import * as storgeService from '../services/storage'
import _ from 'lodash'
import moment from 'moment'
import localforage from 'localforage'

class App extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  // 组件在载入之前调用
  componentWillMount () {
    
  }

  // 组件在载入之后调用
  componentDidMount () {
    this.props.actions.initialMain()
  }

  // 当组件传入新参数时调用
  componentWillReceiveProps (nextProps) {
    let { mainWindowAuth, noteBookList, noteBookIniial, NoteBookList } = nextProps
    if (mainWindowAuth) {
      window.reload && window.reload('PAGE_MAIN_ARGS', mainWindowAuth)
      noteBookIniial && this.props.actions.rootNoteBookList(NoteBookList)
    }
    else {
      window.reload && window.reload('PAGE_SIGN_ARGS')
    }
  }

  render () {
    let { 
      initialMainWidow, 
      mainWindowAuth, 
      loginMainPending,
      loginMainError,
      loginMainMessage,
      modelOpened,
      modelOption,
      noteBookList,
      noteBookParams,
      children 
    } = this.props
    let mainView = mainWindowAuth 
      ? <CoreLayout
          noteBookList={noteBookList}
          location={this.props.location}
          noteBookParams={noteBookParams}
          openModal={this.props.actions.openModal.bind(this)} >
          {children}
        </CoreLayout>
      : <LoginPage 
          actions={this.props.actions}
          pending={loginMainPending}
          errcode={loginMainError}
          message={loginMainMessage} />
    return (
      <div className="app">
        { initialMainWidow ? <LoadingPage /> : mainView }
        <Modal.AuthInfo 
          visible={modelOpened === 'authInfo'}
          auth={mainWindowAuth}
          closeModel={this.props.actions.openModal.bind(this)} />
        <Modal.AddNotebook 
          visible={modelOpened === 'addNotebook'}
          closeModel={this.props.actions.openModal.bind(this)} />
        <Modal.CogNotebook
          visible={modelOpened === 'cogNotebook'}
          options={modelOption}
          closeModel={this.props.actions.openModal.bind(this)} />
      </div>
    )
  }

  renderMainView () {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions, rootNoteBookList }, dispatch)
  }
}

const mapStateToProps = (state) => ({
  initialMainWidow    : state.Root.initialMainWidow,
  mainWindowAuth      : state.Root.mainWindowAuth,

  loginMainPending    : state.Root.loginMainPending,
  loginMainError      : state.Root.loginMainError,
  loginMainMessage    : state.Root.loginMainMessage,

  modelOpened         : state.Root.modelOpened,
  modelOption         : state.Root.modelOption,

  noteBookList        : state.Notebook.noteBook,
  noteBookIniial      : state.Notebook.listInitial,
  NoteBookList        : state.Root.noteBookList,

  noteBookParams      : state.Notes.notebook,

})

export default connect(mapStateToProps, mapDispatchToProps)(App)