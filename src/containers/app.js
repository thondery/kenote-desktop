import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from './reducer'
import LoadingPage from '../components/loading-page'
import LoginPage from '../components/login-page'
import 'font-awesome/css/font-awesome.css'
import '../styles/core.scss'
import CoreLayout from '../layouts/core'

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
    let { mainWindowAuth } = nextProps
    if (mainWindowAuth) {
      window.reload && window.reload('PAGE_MAIN_ARGS', mainWindowAuth)
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
      children 
    } = this.props
    let mainView = mainWindowAuth 
      ? <CoreLayout
          auth={mainWindowAuth}
          logout={this.props.actions.logoutMain.bind(this)} >
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
      </div>
    )
  }

  renderMainView () {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  }
}

const mapStateToProps = (state) => ({
  initialMainWidow    : state.Root.initialMainWidow,
  mainWindowAuth      : state.Root.mainWindowAuth,

  loginMainPending    : state.Root.loginMainPending,
  loginMainError      : state.Root.loginMainError,
  loginMainMessage    : state.Root.loginMainMessage
})

export default connect(mapStateToProps, mapDispatchToProps)(App)