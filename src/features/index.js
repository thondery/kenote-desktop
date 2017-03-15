// ------------------------------------
// Routes & Reducers
// ------------------------------------
import Home from './home'
import Notebook from './notebook'
import Notes from './notes'
import Tags from './tags'
import Trash from './trash'
import HomeReducer from './home/reducer'
import NotebookReducer from './notebook/reducer'
import NotesReducer from './notes/reducer'
import TagsReducer from './tags/reducer'
import TrashReducer from './trash/reducer'

export const Routes = [
  Home,
  Notebook,
  Notes,
  Tags,
  Trash,
]

export const Reducers = {
  Home: HomeReducer,
  Notebook: NotebookReducer,
  Notes: NotesReducer,
  Tags: TagsReducer,
  Trash: TrashReducer,
}