import React from 'react'
import { shallow } from 'enzyme'
import PageNotFound from 'components/page-not-found'

describe('components/page-not-found', () => {
  let _wrapper

  beforeEach(() => {
    _wrapper = shallow(<PageNotFound />)
  })

  it('Renders node for a message', () => {
    const pageNotFound = _wrapper.find('h1')
    expect(pageNotFound).to.exist
    expect(pageNotFound.text()).to.match(/Page Not Found./)
  })
})