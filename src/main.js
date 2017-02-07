import 'babel-polyfill'
import 'isomorphic-fetch'
import React from 'react'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'
import { browserHistory, hashHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/root'
import configureStore from './store/configureStore'

const store = configureStore()
const history = syncHistoryWithStore(__DESKTOP__ ? hashHistory : browserHistory, store)

let MOUNT_NODE = document.getElementById('root')
if (!MOUNT_NODE) {
  MOUNT_NODE = document.createElement('div')
  MOUNT_NODE.id = 'root'
  document.body.appendChild(MOUNT_NODE)
}

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  MOUNT_NODE
)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/root', () => {
    const NextRoot = require('./containers/root').default // eslint-disable-line
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      MOUNT_NODE
    )
  })
}