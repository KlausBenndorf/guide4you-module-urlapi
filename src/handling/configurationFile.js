import { assertRelativePath } from '../utilities'

export const configurationFileParam = {
  keys: [ 'conf' ],
  setEvent: 'beforeConfigLoad',
  setToMap: (map, query) => {
    if (query.isSet('conf')) {
      let val = query.getInjectUnsafeVal('conf').trim()
      assertRelativePath(val)
      map.set('configFileName', val)
    }
  },
  getFromMap: (map) => {
    return {
      conf: map.get('configFileName')
    }
  }
}
