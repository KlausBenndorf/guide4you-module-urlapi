import { assertRelativePath } from '../utilities'

export const layerConfigurationFileParam = {
  keys: [ 'layconf' ],
  setEvent: 'beforeConfigLoad',
  setToMap: (map, query) => {
    if (query.isSet('layconf')) {
      let val = query.getInjectUnsafeVal('layconf').trim()
      assertRelativePath(val)
      map.set('layerConfigFileName', val)
    }
  },
  getFromMap: (map) => {
    return {
      layconf: map.get('layerConfigFileName')
    }
  }
}
