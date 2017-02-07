import React from 'react'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, shallow } from 'enzyme'
import ConnectedHomePage from 'features/home/container'
import HomePage from 'features/home/component'

describe('features/home', () => {
  it('redux connect works', () => {
    const pageProps = {
      
    }
    const store = createStore(state => state, pageProps)

    const wrapper = render(
      <Provider store={store}>
        <ConnectedHomePage />
      </Provider>
    )
    expect(wrapper).to.exist
  })

  it('should render node', () => {
    const pageProps = {
      
    }
    const renderedComponent = shallow(
      <HomePage {...pageProps} />
    )

    expect(
      renderedComponent.node
    ).to.exist
  })
})