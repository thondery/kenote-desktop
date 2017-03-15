import Notebook from './container'

export default {
  path: 'notebook',
  name: 'Notebook',
  component: Notebook,
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: Notebook, isIndex: true },
    { path: ':notebook', name: '', component: Notebook },
  ]
}