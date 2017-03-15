import React, { Component, PropTypes } from 'react'
import { Modal, Form, Button } from 'antd'
import './index.scss'

export default class AuthInfo extends Component {
  // 定义参数类型
  static propTypes = {
    visible: PropTypes.bool,
    closeModel: PropTypes.func,
    auth: PropTypes.object
  }

  // 设置参数默认值
  static defaultProps = {
    visible: false,
    closeModel: () => null,
    auth: null
  }

  // 组件初始化
  constructor (props) {
    super(props)
    this.state = {
      visible: false
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
    let { visible } = nextProps
    if (visible === this.props.visible) return
    this.setState({ visible })
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
    
    return (
      <Modal 
        title="账户信息" 
        wrapClassName="vertical-center-modal"
        onOk={this.handleOk.bind(this)} 
        onCancel={this.handleCancel.bind(this)}
        footer={[
          <Button key="back" size="large" onClick={this.handleCancel.bind(this)}>关闭</Button>
        ]}
        visible={this.state.visible} >
        <AuthInfoForm auth={this.props.auth} />
      </Modal>
    )
  }

  handleOk() {
    this.setState({ visible: false })
    this.props.closeModel()
  }

  handleCancel (e) {
    this.setState({ visible: false })
    this.props.closeModel()
  }
}

const AuthInfoForm = Form.create()(React.createClass({

  render () {
    const { auth } = this.props
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    return (
      <Form className={'modal-auth-info'}>
        <Form.Item
          {...formItemLayout}
          label={'UID'} >
          <span className="ant-form-text">{auth._id}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={'用户名'} >
          <span className="ant-form-text">{auth.username}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={'电子邮箱'} >
          <span className="ant-form-text">{auth.email}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={'AccessToken'} >
          <span className="ant-form-text">{auth.accesskey}</span>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={'注册时间'} >
          <span className="ant-form-text">{auth.create_at}</span>
        </Form.Item>
      </Form>
    )
  }
}))