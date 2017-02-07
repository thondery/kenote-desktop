import React from 'react'
import { shallow } from 'enzyme'
import App from 'containers/app'

describe('containers/app', () => {
  let _wrapper

  beforeEach(() => {
    _wrapper = shallow(<App />)
  })

  it('Renders node', () => {
    expect(_wrapper.node).to.exist
  })
})