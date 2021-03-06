import { getConfig } from 'guide4you/src/utilities'

import { Module } from 'guide4you/src/Module'
import { URLAPI } from './URLAPI'
import { Marker } from './Marker'

import { WindowDecorator } from 'guide4you/src/controls/WindowDecorator'
import { LinkGeneratorButton } from './controls/LinkGeneratorButton'
import { LinkGenerator } from './LinkGenerator'
import { CloseWindowButton } from './controls/CloseWindowButton'
import { MaximizeButton } from './controls/MaximizeButton'

/**
 * The URLAPI module provides a possibility to control the map with various parameters from the URL. this contains a
 * simple marker class which is a position on the map combined with some text.
 * This module can also generate URL which will reproduce the map in most of its current state.
 * This is used by the control LinkGenerator which can display the URL in various forms and by the LinkGeneratorButton
 * which can additionally let the user set the marker on the map and give it a text.
 *
 * The URLAPI module extends the G4UMapOptions by 2 parameters:
 * @property {string} [apiMode='both'] can be 'url', 'js' or 'both'
 * @property {object} [apiInit] initial values for the api
 */
export class URLAPIModule extends Module {
  constructor (options) {
    super(options)
    if (options && options.hasOwnProperty('moduleParameters')) {
      this.moduleParameters_ = options.moduleParameters
    } else {
      this.moduleParameters_ = []
    }
  }

  /**
   * @param {G4UMap} map
   */
  setMap (map) {
    super.setMap(map)
    let options = map.get('options')
    map.set('urlApi', new URLAPI({
      map: map,
      moduleParameters: this.moduleParameters_,
      mode: options.apiMode,
      init: options.apiInit
    }))
  }

  /**
   * This method is called once when the map is configured
   * @param mapConfig
   * @returns {undefined}
   */
  configureUI (mapConfig) {
    let marker = this.getMap().get('marker')

    if (marker) {
      marker.setMap(null)
    }

    let curConfig = getConfig(mapConfig, 'marker')

    if (curConfig) {
      marker = new Marker(mapConfig.marker)
      marker.setMap(this.getMap())
      this.getMap().set('marker', marker)
    } else {
      this.getMap().set('marker', undefined)
    }
  }

  /**
   * This method is called if the ControlFactory cant construct controls of this type
   * @param {string} controlType
   * @param {g4uControlOptions} options
   * @param {ComposedControl|G4UMap} receiver
   * @returns {undefined|Control}
   */
  createControl (controlType, options, receiver) {
    switch (controlType) {
      case 'linkGeneratorButton':
        return new WindowDecorator({
          component: new LinkGeneratorButton(options)
        })
      case 'linkGenerator':
        return new LinkGenerator(options)
      case 'closeWindowButton':
        return new CloseWindowButton(options)
      case 'maximizeButton':
        return new MaximizeButton(options)
    }
  }
}
