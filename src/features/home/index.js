import Home from './container'

export default {
  path: '',
  name: 'Home',
  component: Home,
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: Home, isIndex: true }
  ]
}