'use strict';
import {StatusBar, Platform, Alert} from 'react-native'
import queryString from 'query-string'
import Toast from "../components/common/Toast";
import axios from 'axios'

function setNetworkIndicator(visible) {
  if (Platform.OS === 'ios') {
    StatusBar.setNetworkActivityIndicatorVisible(visible)
  }
}

const post = function (url, body, token) {
  return _request('post', url, body, token)
};

const get = function (url, query, token) {
  return _request('get', url, query, token)
};

async function _request(method, url, data = {}, token) {
  if (method === 'get') {
    let query = queryString.stringify(data)
    url += query ? ('?' + query) : ''
    data = null
  }

  let config = {
    url, method, data,
    timeout: 10000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `JWT ${token}` : null
    }
  }

  console.log(`\nurl:${url} \ndata:${JSON.stringify(data)}\nmethod:${method}`)

  try {
    let response = (await axios(config)).data
    if (response.success) {
      return {data: response.data}
    } else {
      throw new Error(response.error)
    }
  } catch (e) {
    return {error: _handleError(e, config)}
  }
}

function _handleError(e, config) {
  let error = new Error(e.message)
  if (e.message.indexOf('timeout') >= 0) {
    error.message = '请求超时'
  } else {
    error.message = '请求失败，请检查网络设置'
  }
  error.requestConfig = config
  error.code = e.request.status
  error.status = e.request.status
  delete error.line
  delete error.column
  delete error.sourceURL

  if (e.response) {
    const {status, data, statusText} = e.response
    Object.assign(error, {status, data, statusText})
    if (data.error) {
      error.message = data.error
    }
  }

  console.log('Request Error ↓↓↓↓↓↓↓')
  console.log(error)
  return error
}

const ToastError = (e, defaultToast) => {
  if (!(e instanceof Error)) {
    return
  }
  Toast.show(e && e.message ? e.message : (defaultToast || '请求失败'))
  return e
}

module.exports = {
  get,
  post,
  ToastError
};
