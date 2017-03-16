import React, { Component, PropTypes } from 'react'
import { Layout, Row, Col, Modal } from 'antd'
import './style.scss'
import PageHeader from '../../components/page-header'
import NotebookItem from '../../components/itembox/notebook'
import NotebookItemLite from '../../components/itembox/notebook-lite'
import _ from 'lodash'

const { Header, Content } = Layout
const Confirm = Modal.confirm

/*
 * Props
 * - params.notebook => {:notebook}
 * - router.params.notebook => {:notebook}
 * - location.pathname => '/notebook/{:notebook}'
 * - location.search => '?s=13'
 */
export default class Notebook extends Component {
  // 定义参数类型
  static propTypes = {

  }

  // 设置参数默认值
  static defaultProps = {

  }

  // 组件初始化
  constructor (props) {
    super(props)
    this.state = { // 
      col: 6,
      row: 5,
      noteBookList: []
    }
  }

  // 组件在载入之前调用
  componentWillMount () {

  }

  // 组件在载入之后调用
  componentDidMount () {
    let { noteBookList, listSortBy, listFilter } = this.props
    this.updateCol(window.innerWidth, window.innerHeight)
    window.onresize = () => {
      this.updateCol(window.innerWidth, window.innerHeight)
    }
    this.getFilterList(noteBookList, listSortBy, listFilter)
  }

  // 当组件传入新参数时调用
  componentWillReceiveProps (nextProps) {
    let { noteBookList, listSortBy, listFilter } = nextProps
    //if (listSortBy !== this.props.listSortBy) {
      this.getFilterList(noteBookList, listSortBy, listFilter)
    //}
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
    let { selectIndex, listJustify, listSortBy, listFilter } = this.props
    let { noteBookList } = this.state
    let noteBookListLite = _.chunk(noteBookList, this.state.row)
    return (
      <Layout ref={'notebookLayout'} className={'notebook_layout'}>
        <PageHeader
          addButtonLabel={'新建笔记本'}
          addButtonClick={this.props.actions.openModal.bind(this, 'addNotebook')} 
          searchLabel={'查询笔记本'}
          serachValue={listFilter}
          searchPress={this.props.actions.filterChange.bind(this)}
          sortByTypes={[
            { key: 'name', label: '名称' },
            { key: 'counts', label: '笔记数' },
            { key: 'updateAt', label: '更新时间' },
          ]}
          sortByValue={listSortBy}
          sortByChange={this.props.actions.sortByChange.bind(this)}
          justifyContent={listJustify}
          justifyChange={this.props.actions.setJustify.bind(this)}
          />
        <Content className={'notebook_layout_content'} style={listJustify === 'th' ? { overflowY: 'scroll' } : null}>
          {listJustify === 'th' ? (
            <Row justify={'center'} className={'animated slideIn'}>
              {noteBookList.map( (item, i) => {
                return (
                  <Col key={i} span={this.state.col} style={{ textAlign: 'center', padding: 10 }}>
                    <NotebookItem 
                      data={item} 
                      onClick={this.selectedHandle.bind(this, item.clientId || item._id)} 
                      selected={selectIndex === (item.clientId || item._id)}
                      onCogNotebook={this.cogNotebookHandle.bind(this, item)}
                      onTrashNotebook={this.trashNotebookHandle.bind(this, item)}
                      onDoubleClick={this.onDoubleClickHandle.bind(this, item)}
                      />
                  </Col>
                )
              })}
            </Row>
          ) : (
            <div className={'notebook-list-lite animated slideIn'}>
              {noteBookListLite.map( (group, n) => {
                return (
                  <div key={`n-${n}`}>
                    {group.map( (item, i) => {
                      let k = (n * this.state.row) + i
                      return (
                        <NotebookItemLite
                          key={k}
                          data={item} 
                          onClick={this.selectedHandle.bind(this, item.clientId || item._id)} 
                          selected={selectIndex === (item.clientId || item._id)}
                          onCogNotebook={this.cogNotebookHandle.bind(this, item)}
                          onTrashNotebook={this.trashNotebookHandle.bind(this, item)}
                          onDoubleClick={this.onDoubleClickHandle.bind(this, item)}
                          />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </Content>
      </Layout>
    )
 
  }

  selectedHandle (id) {
    if (id === this.props.selectIndex) return
    this.props.actions.selectItem(id)
  }

  cogNotebookHandle (item) {
    this.props.actions.openModal('cogNotebook', item)
  }

  trashNotebookHandle (item) {
    // 
    //this.props.actions.removeNoteBook(item.clientId || item._id)
    Modal.confirm({
      title: `您确定要删除笔记本 ‘${item.name}’ 吗？`,
      content: `此笔记本内的任何笔记将一并删除，且不可恢复`,
      onOk: () => {
        this.props.actions.removeNoteBook(item.clientId || item._id)
      },
      onCancel() {},
    })
  }

  onDoubleClickHandle (item) {
    console.log(item.clientId || item._id)
    let { router } = this.props
    this.props.actions.changeParams(item.clientId || item._id)
    router.push(`/notes/${item.clientId || item._id}`)
  }

  getFilterList (list, tag, filter) {
    //let { noteBookList } = this.props
    //let list = noteBookList
    if (filter && filter.length > 0) {
      let re = new RegExp(filter)
      list = _.filter(list, o => re.test(o.name) )
    }
    if (tag === 'name') {
      list = _.sortBy(list, ['name'])
    }
    this.setState({ noteBookList: list })
  }

  updateCol (width, height) {
    let col, row
    if (width <= 1100) {
      col = 8
    }
    else if (width <= 1500) {
      col = 6
    }
    else if (width <= 1900) {
      col = 4
    }
    else {
      col = 3
    }
    if (col !== this.state.col) {
      this.setState({ col: col })
    }
    let baseHeight = __DESKTOP__ ? 180 : 135
    row = Math.round((height - baseHeight) / 56)
    if (row !== this.state.row) {
      this.setState({ row: row })
    }
  }
}

// this.props.params.notebook