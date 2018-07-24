import {create} from "dva-core";

import appModel from "./app";
import authModel, {authTypes} from './auth'
import vogueModel, {vogueTypes} from './vogue'

const app = create()
app.start()
let store = app._store
app.getStore = () => store
app.model(appModel)
app.model(authModel)
app.model(vogueModel)

const types = {
  ...authTypes,
  ...vogueTypes
}

export {
  store,
  types
}
