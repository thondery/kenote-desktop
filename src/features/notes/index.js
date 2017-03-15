import Notes from './container'

export default {
  path: 'notes',
  name: 'Notes',
  component: Notes,
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: Notes, isIndex: true }
  ]
}