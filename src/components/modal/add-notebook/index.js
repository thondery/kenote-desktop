import React, { Component, PropTypes } from 'react'
import { Modal, Form, Button, Input } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FontAwesome from '../../font-awesome'
import './index.scss'
import * as actions from '../../../features/notebook/action'

class AddNotebook extends Component {
  // 定义参数类型
  static propTypes = {
    visible: PropTypes.bool,
    closeModel: PropTypes.func
  }

  // 设置参数默认值
  static defaultProps = {
    visible: false,
    closeModel: () => null
  }

  // 组件初始化
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      btnDisabled: true
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
    let { visible, addPending, addError, addStatus } = nextProps
    if (addStatus && addStatus !== this.props.addStatus && addStatus.code === 0) {
      this.handleCancel()
    }
    if (visible === this.props.visible) return
    this.setState({ visible, btnDisabled: true })
    if (this.refs.addNotebook) {
      this.refs.addNotebook.resetFields()
    }
    visible && this.props.actions.addNoteBookStart()
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
    let { addPending, addStatus } = this.props
    return (
      <Modal 
        title="新建笔记本" 
        wrapClassName="vertical-center-modal"
        onOk={this.handleOk.bind(this)} 
        onCancel={this.handleCancel.bind(this)}
        footer={[
          <Button 
            key="back" 
            size="large" 
            onClick={this.handleCancel.bind(this)}>
            取消
          </Button>,
          <Button 
            key="add" 
            size="large" 
            loading={addPending} 
            disabled={this.state.btnDisabled} 
            onClick={this.handleOk.bind(this)}>
            创建
          </Button>
        ]}
        visible={this.state.visible} >
        {addStatus && addStatus.code > 0 
          ? <span className="modal-form-error-tips">{addStatus.message}</span> 
          : null}
        <AddNotebookForm 
          ref={'addNotebook'}
          onChange={this.handleChange.bind(this)} />
      </Modal>
    )
  }

  handleChange (value) {
    this.setState({ btnDisabled: value.length === 0 })
  }

  handleOk() {
    let fields = this.refs.addNotebook.getFieldsValue()
    this.props.actions.addNoteBook(fields.notebook_name)
  }

  handleCancel (e) {
    this.setState({ visible: false })
    this.props.closeModel()
  }
}

const AddNotebookForm = Form.create()(React.createClass({
  checkNotebookName (rule, value, callback) {
    const form = this.props.form
    this.props.onChange(value)
    let reg = /^[0-9A-Za-z\u4e00-\u9fa5\-\_]+$/
    let len = getStringByte(value)
    if (!reg.test(value)) {
      callback(rule.message)
    }
    if (len > 12) {
      callback(rule.message)
    }
    callback()
  },
  render () {
    const { getFieldDecorator } = this.props.form
    const { error } = this.props
    const formItemLayout = {
      wrapperCol: { span: 24 },
    }
    return (
      <Form className={'modal-form-notebook'}>
        <Form.Item
          {...formItemLayout}
          hasFeedback
          help={'名称限制在6个中文或12个字母内'} >
          {getFieldDecorator('notebook_name', {
            rules: [{
              validator: this.checkNotebookName, message: '名称限制在6个中文或12个字母内'
            }],
          })(
            <Input 
              placeholder={'笔记本名'} 
              size={'large'} 
              style={{height: 40, fontSize: 14}}
              prefix={<FontAwesome type={'book'} />} />
          )}
        </Form.Item>
      </Form>
    )
  }
}))

function getStringByte (str) {
  var char = str.replace(/[^\x00-\xff]/g, '**')
  return char.length
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  }
}

const mapStateToProps = (state) => ({
  addPending: state.Notebook.addPending,
  addError: state.Notebook.addError,
  addStatus: state.Notebook.addStatus
})

export default connect(mapStateToProps, mapDispatchToProps)(AddNotebook)