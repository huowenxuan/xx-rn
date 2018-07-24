import * as Storage from '../utils/storage'
import {createNamespaceTypes, createAction} from './helper'
import API from '../services/API'
import Request from '../services/request'

const namespace = 'auth'

const types = {
  updateState: 'updateState',
  loadAuthStorage: 'loadAuthStorage',
  passwordLogin: 'passwordLogin'
}

export const authTypes = createNamespaceTypes(namespace, types)

export default {
  namespace,
  state: {
    login: false,
  },
  reducers: {
    [types.updateState](state, {payload}) {
      return {...state, ...payload}
    },
  },
  effects: {
    * [types.loadAuthStorage](action, {call, put}) {
      const auth = yield call(Storage.loadAuth)
      yield put(createAction(types.updateState)({auth, loading: false}))
    },
    * [types.passwordLogin]({payload, resolve, reject}, {call, put}) {
      let {phone, password} = payload
      phone = '17600105574'
      password = '112233'
      const {error, data} = yield call(Request.post, API.passwordLogin, {username: phone, password})
      if (error) {
        reject(error)
      } else {
        resolve(data)
        Storage.saveAuth(data.info, data.token)
        yield put(createAction(types.updateState)({auth: data}))
      }
    },
    * logout(action, {call, put}) {
      yield call(Storage.set, 'login', false)
      yield put(createAction(types.updateState)({login: false}))
    },
  },
  subscriptions: {
    setup({dispatch}) {
    },
  },
}
