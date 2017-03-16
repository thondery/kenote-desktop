import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Notes from './notes'
import * as actions from './action.js'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  }
}

const mapStateToProps = (state) => ({
  noteBookList        : state.Notebook.noteBook,
  notebook            : state.Notes.notebook,
  currentNote         : state.Notes.currentNote,
  
})

export default connect(mapStateToProps, mapDispatchToProps)(Notes)