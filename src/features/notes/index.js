import Notes from './container'

export default {
  path: 'notes',
  name: 'Notes',
  component: Notes,
  childRoutes: [
    { path: 'all', name: 'Default page', component: Notes, isIndex: true },
    { path: ':notebook', name: '', component: Notes },
  ]
}


/*
 - /notes              -> 全部
 - /notes/:notebook    -> 笔记本
*/