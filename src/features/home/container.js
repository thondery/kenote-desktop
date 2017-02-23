import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Home from './component'
import actions from './action.js'

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  }
}

const mapStateToProps = (state) => ({
  mainWindowAuth      : state.Root.mainWindowAuth,
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)