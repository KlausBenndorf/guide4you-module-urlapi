
export const visibleLayersParam = {
  keys: [ 'vislay' ],
  setEvent: 'afterConfiguring',
  setToMap: (map, query) => {
    if (query.isSet('vislay')) {
      let layerIds = query.getArray('vislay')

      for (let id of layerIds) {
        id = id.split('#')
        let layer = map.getLayerGroup().findLayer(l => l.get('id') !== undefined && l.get('id').toString() === id[0])
        if (layer.getSource && layer.getSource().updateParams) {
          layer.getSource().updateParams({ LAYERS: id.slice(1) })
        }
        layer.setVisible(true)
      }
    }
  },
  getFromMap: (map, query) => {
    if (!query.isExcluded('vislay')) {
      let layerIds = []

      const forEachLayer = layer => {
        if (!layer.getLayers && layer.getVisible()) {
          if (layer.getSource && layer.getSource().getParams) {
            layerIds.push(layer.get('id') + '#' + layer.getSource().getParams()['LAYERS'].join('#'))
          } else {
            layerIds.push(layer.get('id'))
          }
        }
      }

      map.get('baseLayers').recursiveForEach(forEachLayer)
      map.get('featureLayers').recursiveForEach(forEachLayer)

      return {
        vislay: layerIds.join(',')
      }
    }
  }
}
