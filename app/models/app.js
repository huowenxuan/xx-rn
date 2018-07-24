import { createAction } from '../utils'

export default {
  namespace: 'app',
  state: {
    loading: true,
    fetching: false,
    networkError: null
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
  },
}
