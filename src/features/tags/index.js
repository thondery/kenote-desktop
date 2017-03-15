import Tags from './container'

export default {
  path: 'tags',
  name: 'Tags',
  component: Tags,
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: Tags, isIndex: true }
  ]
}