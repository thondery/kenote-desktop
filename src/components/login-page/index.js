import React, { Component, PropTypes } from 'react'
import { Form, Input, Button, Checkbox, Tooltip } from 'antd'
import _ from 'lodash'
import './index.scss'
import Logo from '../../assets/images/kenote.svg'
import WinTools from '../win-tools'

const FormItem = Form.Item

export default class LoginPage extends Component {
  // 定义参数类型
  static propTypes = {
    actions: PropTypes.object,
    pending: PropTypes.bool,
    errcode: PropTypes.number,
    message: PropTypes.string
  }

  // 设置参数默认值
  static defaultProps = {
    actions: {},
    pending: false,
    errcode: undefined,
    message: undefined
  }

  // 组件初始化
  constructor (props) {
    super(props)
    this.state = {
      tabName: 'login',
      tab: {
        login: 2,
        register: 2
      },
      form: {
        username: undefined,
        password: undefined
      },
      formSubmit: false
    }
  }

  // 组件在载入之前调用
  componentWillMount () {
    //window.reload && window.reload('PAGE_SIGN_ARGS')
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
    let { pending, errcode, message } = this.props
    let tipsMessage = undefined
    if (!pending) {
      tipsMessage = errcode > 0 && message
    }
    let formComponent = {
      ['login']: this.renderLoginForm(),
      ['register']: this.renderRegisterForm()
    }
    return (
      <div className="login-page">
        <img src={Logo} />
        <span className="error-tips">{tipsMessage}</span>
        {formComponent[this.state.tabName]}
      </div>
    )
  }

  renderLoginForm () {
    let { formSubmit, form } = this.state
    return (
      <div>
        {window.__MACOS__ && __DESKTOP__ ? <WinTools showMode={'min'} /> : null}
        <Form 
          className="login-form" 
          onSubmit={this.onSubmitHandle.bind(this)}
          horizontal>
          <FormItem>
            <Input 
              ref={'username'}
              placeholder="用户名或邮箱" 
              value={form.username}
              onChange={this.onChangeHandle.bind(this, 'username')} 
              onPressEnter={this.onPressEnterHandle.bind(this, 'password')}
              disabled={this.props.pending}
              size="large" />
          </FormItem>
          <FormItem>
            <Input 
              ref={'password'}
              type="password" 
              placeholder="密码" 
              value={form.password}
              onChange={this.onChangeHandle.bind(this, 'password')}
              disabled={this.props.pending}
              size="large" />
          </FormItem>
          <FormItem>
            <Button 
              ref={'submit'}
              type="primary" 
              htmlType="submit" 
              className="login-form-button" 
              size="large" 
              loading={this.props.pending}
              disabled={!formSubmit}>
              登录
            </Button>
          </FormItem>
        </Form>
        <div className="login-footer">{this.props.pending}
          <a onClick={() => this.switchTab('register')}>注册 Kenote</a>
        </div>
      </div>
    )
  }

  onChangeHandle (name, evt) {
    let { form, tab, tabName } = this.state
    form[name] = evt.target.value
    let len = 0
    for (let k in form) {
      len += form[k] ? 1 : 0
    }
    let formSubmit = len >= tab[tabName]
    this.setState({ form, formSubmit })
  }

  onPressEnterHandle (name, evt) {
    if (!evt.target.value) return
    this.refs[name].focus()
  }

  onSubmitHandle (evt) {
    evt.preventDefault()
    if (this.props.pending) return
    console.log('submit')
    console.log(this.state.form)
    let { username, password } = this.state.form
    this.props.actions.loginMain(username, password)
  }

  renderRegisterForm () {
    let { formSubmit, form } = this.state
    return (
      <div className="animated fadeInRight">
        <Form
          className="login-form" 
          onSubmit={this.onSubmitHandle.bind(this)}
          horizontal>
          <FormItem>
            <Input 
              ref={'username'}
              placeholder="邮箱" 
              value={form.username}
              onChange={this.onChangeHandle.bind(this, 'username')} 
              onPressEnter={this.onPressEnterHandle.bind(this, 'password')}
              size="large" />
          </FormItem>
          <FormItem>
            <Input 
              ref={'password'}
              type="password" 
              placeholder="密码" 
              value={form.password}
              onChange={this.onChangeHandle.bind(this, 'password')}
              size="large" />
          </FormItem>
          <FormItem>
            <Button 
              ref={'submit'}
              type="primary" 
              htmlType="submit" 
              className="login-form-button" 
              size="large" 
              loading={false}
              disabled={!formSubmit}>
              注册
            </Button>
          </FormItem>
        </Form>
        <div className="login-footer">
          <a onClick={() => this.switchTab('login')}>登录 Kenote</a>
        </div>
      </div>
    )
  }

  renderForgotForm () {

  }

  switchTab (tabName) {
    this.setState({ 
      tabName: tabName,
      form: {
        username: undefined,
        password: undefined
      },
      formSubmit: false
    })
  }

}