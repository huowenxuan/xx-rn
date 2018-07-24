import * as Storage from '../utils/storage'
import {createNamespaceTypes, createAction} from './helper'
import API from '../services/API'
import Request from '../services/request'

const namespace = 'vogue'

const types = {
  updateState: 'updateState',
  query: 'query',
  delete: 'delete'
}

export const vogueTypes = createNamespaceTypes(namespace, types)

export default {
  namespace,
  state: {
    vogue: {}
  },
  reducers: {
    [types.updateState](state, {payload}) {
      return {...state, ...payload}
    },
  },
  effects: {
    * [types.query]({payload, resolve, reject}, {call, put}) {
      // let {phone, password} = payload
      const {error, data} = yield call(Request.get, API.queryVogue)
      if (error) {
        reject(error)
      } else {
        resolve(data)
        yield put(createAction(types.updateState)({vogue: data}))
      }
    },
    * [types.delete]({payload, resolve, reject}, {call, put}) {
      const {error, data} = yield call(Request.post, API.deleteVogue)
      if (error) {
        reject(error)
      } else {
        resolve(data)
        yield put(createAction(types.updateState)({vogue: {}}))
      }
    },
  },
  subscriptions: {
    setup({dispatch}) {
    },
  },
}
