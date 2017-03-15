import Trash from './container'

export default {
  path: 'trash',
  name: 'Trash',
  component: Trash,
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: Trash, isIndex: true }
  ]
}