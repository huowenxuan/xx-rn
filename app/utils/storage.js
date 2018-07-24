import Storage from 'react-native-storage';
import {AsyncStorage} from 'react-native';

// key中不可以出现"_"，所以用驼峰
const KEY = {
  Auth: 'Auth',
}

const storage = new Storage({
  size: 1000, // 最大容量，默认值1000条数据循环存储
  storageBackend: AsyncStorage, // 存储引擎，如果不指定则数据只会保存在内存中，重启后即丢失
  defaultExpires: null, // 过期时间，null永不过期a
  enableCache: true, // 读写时在内存中缓存数据。
})

export const saveAuth = async (userInfo, token) => {
  await storage.save({
    key: KEY.Auth,
    data: {
      info: userInfo,
      token: token
    }
  })
}

let _load = async (key) => {
  try {
    return await storage.load({key})
  } catch(e) {
    return null
  }
}

export const loadAuth = () => {
  return _load(KEY.Auth)
}

export const clearAuth = () => {
  // clearMapForKey 不管用
  return storage.remove({key: KEY.Auth})
}

