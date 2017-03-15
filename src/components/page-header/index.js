import React, { Component, PropTypes } from 'react'
import { Layout, Button, Radio, Input, Tooltip, Icon } from 'antd'
import FontAwesome from '../font-awesome'
import './index.scss'

const { Header } = Layout
const { Search } = Input
const ButtonGroup = Button.Group


export default class PageHeader extends Component {
  // 定义参数类型
  static propTypes = {
    addButtonLabel: PropTypes.string,
    addButtonClick: PropTypes.func,
    searchLabel: PropTypes.string,
    serachValue: PropTypes.string,
    searchPress: PropTypes.func,
    sortByTypes: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
    })),
    sortByValue: PropTypes.string,
    sortByChange: PropTypes.func,
    justifyContent: PropTypes.oneOf([undefined, 'th', 'list']),
    justifyChange: PropTypes.func,
  }

  // 设置参数默认值
  static defaultProps = {
    addButtonLabel: '新建',
    addButtonClick: () => null,
    searchLabel: '查询',
    serachValue: undefined,
    searchPress: () => null,
    sortByTypes: [],
    sortByValue: undefined,
    sortByChange: () => null,
    justifyContent: undefined,
    justifyChange: () => null
  }

  // 组件初始化
  constructor (props) {
    super(props)
    this.state = {
      serachValue: '',
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
    let { 
      addButtonLabel, 
      addButtonClick,
      searchLabel,
      serachValue,
      searchPress,
      sortByTypes,
      sortByValue,
      sortByChange,
      justifyContent,
      justifyChange
    } = this.props
    return (
      <Header className={'layout-page-header'}>
        <div>
          <Tooltip title={addButtonLabel}>
            <Button 
              size="small"
              icon="plus"
              onClick={addButtonClick} >
              {addButtonLabel}
            </Button>
          </Tooltip>
          <Input
            size="small"
            placeholder={searchLabel}
            style={{ width: 180 }}
            value={serachValue}
            suffix={serachValue ? 
              <Icon 
                type="close-circle" 
                style={{ color: '#999' }}
                onClick={() => searchPress(undefined)} /> 
              : null}
            onChange={ e => searchPress(e.target.value) } />
        </div>
        <Radio.Group 
          onChange={ e => sortByChange(e.target.value) } 
          defaultValue={sortByValue}
          size="small">
          {sortByTypes.map( (item, i) => {
            return (
              <Radio.Button 
                key={i} 
                value={item.key} >
                {item.label}
              </Radio.Button>
            )
          })}
        </Radio.Group>
        {justifyContent ? 
          <Radio.Group 
            onChange={ e => justifyChange(e.target.value) }  
            defaultValue={justifyContent}
            size="small" >
            <Radio.Button value="th">
              <FontAwesome type="th" style={{ fontSize: '1em' }} />
            </Radio.Button>
            <Radio.Button value="list">
              <FontAwesome type="align-justify" style={{ fontSize: '1em' }} />
            </Radio.Button>
          </Radio.Group> 
          : <div />}
      </Header>
    )
  }
}