
/**
 * 用于导出model的types
 * 例如namespace为auth有一个login的type，导出为{login: auth/login}
 */
export const createNamespaceTypes = (name, types) => {
  let _types = {}
  for (let t in types) {
    _types[t] = `${name}/${t}`
  }
  return {[name]: _types}
}

/**
 * dispatch的参数 dispatch(createAction(type)({}))
 */
export const createAction = type => (payload, resolve, reject) => ({ type, payload, resolve, reject })
