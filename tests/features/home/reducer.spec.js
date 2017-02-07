import reducer from 'features/home/reducer'

describe('feature/home/reducer', () => {
  it('feature reducer does nothing if no matched action', () => {
    const prevState = {}
    const state = reducer(
      prevState,
      { type: '__unknown_action_type__' }
    )
    expect(state).to.equal(prevState)
  })

  // TODO: add global reducer test if needed.
})