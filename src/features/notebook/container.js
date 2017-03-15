import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Notebook from './notebook'
import * as actions from './action.js'
import { openModal } from '../../containers/reducer'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions, openModal }, dispatch)
  }
}

const mapStateToProps = (state) => ({
  addPending          : state.Notebook.addPending,
  cogPending          : state.Notebook.cogPending,
  noteBookList        : state.Notebook.noteBook,
  selectIndex         : state.Notebook.selectIndex,
  listJustify         : state.Notebook.listJustify,
  listSortBy          : state.Notebook.listSortBy,
  listFilter          : state.Notebook.listFilter,

  removePending       : state.Notebook.removePending,
  removeError         : state.Notebook.removeError,
  removeStatus        : state.Notebook.removeStatus
})

export default connect(mapStateToProps, mapDispatchToProps)(Notebook)

