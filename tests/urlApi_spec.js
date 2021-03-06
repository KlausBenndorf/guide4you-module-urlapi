import { By, until } from 'selenium-webdriver'
import customDriver from 'guide4you/tests/customDriver'
import { describe, before, after, it } from 'selenium-webdriver/testing/'
import assert from 'selenium-webdriver/testing/assert'
import { waitUntilMapReady } from 'guide4you/tests/testUtils'

import config from './config.js'

// globals in browser
var map

describe('URLAPI', function () {
  this.timeout(config.mochaTimeout)
  let driver

  before(function () {
    driver = customDriver()
    driver.manage().window().setSize(1200, 800)
    driver.manage().setTimeouts(config.seleniumTimeouts)
  })

  after(function () {
    driver.quit()
  })

  it('[lat, lon] should set the center of the map to the with lon and lat specified coordinates', function (done) {
    driver.get(config.testClient + '?lon=0&lat=0').then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      return driver.executeScript(() => map.getView().getCenter())
    }).then(center => {
      assert(center[0]).closeTo(0, 0.0001)
      assert(center[1]).closeTo(0, 0.0001)
      done()
    })
  })

  it('[lat, lon] if lon is missing it should not set the center of the map to the specified coordinates',
    function (done) {
      driver.get(config.testClient + '?lon=0').then(() => {
        return waitUntilMapReady(driver)
      }).then(() => {
        return driver.executeScript(() => map.getView().getCenter())
      }).then(center => {
        assert(Math.abs(center[0])).atLeast(0.001)
        assert(Math.abs(center[1])).atLeast(0.001)
        done()
      })
    })

  it('[lat, lon] if lat is missing it should not set the center of the map to the specified coordinates',
    function (done) {
      driver.get(config.testClient + '?lat=0').then(() => {
        return waitUntilMapReady(driver)
      }).then(() => {
        return driver.executeScript(() => map.getView().getCenter())
      }).then(center => {
        assert(Math.abs(center[0])).atLeast(0.001)
        assert(Math.abs(center[1])).atLeast(0.001)
        done()
      })
    })

  it('[rot] should rotate the map in the specified angle', function (done) {
    driver.get(config.testClient + '?rot=0.314').then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      return driver.executeScript(() => map.getView().getRotation())
    }).then(rotation => {
      assert(rotation).closeTo(Math.PI * (0.314 / 180), 0.001)
      done()
    })
  })

  it('[zoom] should zoom to 16', function (done) {
    driver.get(config.testClient + '?zoom=16').then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      return driver.executeScript(() => window.map.getView().getZoom())
    }).then(zoom => {
      assert(zoom).equalTo(16)
      done()
    })
  })

  it('[zoom] should zoom to 8', function (done) {
    driver.get(config.testClient + '?zoom=8').then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      return driver.executeScript(() => window.map.getView().getZoom())
    }).then(zoom => {
      assert(zoom).equalTo(8)
      done()
    })
  })

  it('[marktext] should set the marker active', function (done) {
    driver.get(config.testClient + '?marktext= text ').then(
      waitUntilMapReady(driver)
    ).then(() => {
      return driver.executeScript(() => map.get('marker').getActive())
    }).then(active => {
      assert(active).equalTo(true)
      done()
    })
  })

  it('[marklat] should set the marker active', function (done) {
    driver.get(config.testClient + '?marklat=0').then(
      waitUntilMapReady(driver)
    ).then(() => {
      return driver.executeScript(() => map.get('marker').getActive())
    }).then(active => {
      assert(active).equalTo(true)
      done()
    })
  })

  it('[marklon] should set the marker active', function (done) {
    driver.get(config.testClient + '?marklon=0').then(
      waitUntilMapReady(driver)
    ).then(() => {
      return driver.executeScript(() => map.get('marker').getActive())
    }).then(active => {
      assert(active).equalTo(true)
      done()
    })
  })

  it('[marklat, marklon] should set the position of the marker to the specified coordinate', function (done) {
    driver.get(config.testClient + '?marklon=0&marklat=0').then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      return driver.executeScript(function () {
        return map.get('marker').getPosition() //, 'EPSG:3857', 'EPSG:4326')
      })
    }).then(markerPos => {
      assert(markerPos[0]).closeTo(0, 0.0001)
      assert(markerPos[1]).closeTo(0, 0.0001)
      done()
    })
  })

  it('[markpop, marktext] should show a feature popup on the marker if marktext is set and markpop isn\'t set',
    function (done) {
      driver.get(config.testClient + '?marktext= text ').then(
        waitUntilMapReady(driver)
      ).then(() => {
        driver.wait(until.elementIsVisible(driver.findElement(By.className('g4u-featurepopup'))))
      }).then(done)
    })

  it('[markpop, marktext] should show a feature popup on the marker if marktext is set and markpop is set to true',
    function (done) {
      driver.get(config.testClient + '?marktext= text &markpop=true').then(() => {
        return waitUntilMapReady(driver)
      }).then(() => {
        driver.wait(until.elementIsVisible(driver.findElement(By.className('g4u-featurepopup'))))
      }).then(done)
    })

  it('[markpop, marktext] should not show a feature popup if marktext is not set (1)', function (done) {
    driver.get(config.testClient + '?marklon=0&marklat=0').then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      let featurePopup = driver.wait(until.elementLocated(By.className('g4u-featurepopup')))
      assert(featurePopup.isDisplayed()).equalTo(false)
    }).then(done)
  })

  it('[markpop, marktext] should not show a feature popup if marktext is not set (2)', function (done) {
    driver.get(config.testClient).then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      let featurePopup = driver.wait(until.elementLocated(By.className('g4u-featurepopup')))
      assert(featurePopup.isDisplayed()).equalTo(false)
    }).then(done)
  })

  it('[markpop, marktext] should not show a feature popup if marktext is set, but markpop is set to false',
    function (done) {
      driver.get(config.testClient + '?marktext= text &markpop=false').then(() => {
        return waitUntilMapReady(driver)
      }).then(() => {
        let featurePopup = driver.wait(until.elementLocated(By.className('g4u-featurepopup')))
        assert(featurePopup.isDisplayed()).equalTo(false)
        done()
      })
    })

  it('[marktext] should show the text inside the feature popup that was specified with marktext',
    function (done) {
      driver.get(config.testClient + '?marktext= text text ').then(() => {
        return waitUntilMapReady(driver)
      }).then(() => {
        let featurePopup = driver.findElement(By.className('g4u-featurepopup'))
        driver.wait(until.elementIsVisible(featurePopup))
        let content = featurePopup.findElement(By.className('g4u-window-content'))
        assert(content.getText()).contains('text text')
        done()
      })
    })

  it('[markpop, marktext] marker popup should have updated its size', function (done) {
    driver.get(config.testClient + '?marktext=texttexttexttexttext').then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      let featurePopup = driver.findElement(By.className('g4u-featurepopup'))
      driver.wait(until.elementIsVisible(featurePopup))
      featurePopup.getSize().then(oldSize => {
        driver.executeScript(function () {
          map.get('featurePopup').update()
        }).then(() => {
          featurePopup.getSize().then(newSize => {
            assert(oldSize[0]).equalTo(newSize[0], 'comparing popup width')
            assert(oldSize[1]).equalTo(newSize[1], 'comparing popup height')
            done()
          })
        })
      })
    })
  })

  it('[clsbtn] should have a close button if the parameter "clsbtn" was set to true (not neccessarily visible)',
    function (done) {
      driver.get(config.testClient + '?clsbtn=true').then(() => {
        return waitUntilMapReady(driver)
      }).then(() => {
        driver.wait(until.elementLocated(By.className('g4u-close-window-button')))
        done()
      })
    })

  it('[clsbtn] should not have a close button if the parameter "clsbtn" was not set to true ' +
    '(not neccessarily visible)', function (done) {
    driver.get(config.testClient + '?clsbtn=false').then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      // return assert(driver.isElementPresent(By.className('g4u-close-window-button'))).equalTo(false)
      return assert(driver.findElements(By.className('g4u-close-window-button')).then(found => !!found.length))
        .equalTo(false)
    }).then(done)
  })

  it('[clsbtn] should not have a close button if the parameter "clsbtn" was not set ' +
    '(not neccessarily visible)', function (done) {
    driver.get(config.testClient).then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      // return assert(driver.isElementPresent(By.className('g4u-close-window-button'))).equalTo(false)
      return assert(driver.findElements(By.className('g4u-close-window-button')).then(found => !!found.length))
        .equalTo(false)
    })
      .then(done)
  })

  it('[avalay] should have only the (base-&feature-)layers available that were setted with the "avalay"' +
    ' parameter (plus the layers which have alwaysVisible)', function (done) {
    function getLayerAvailabilities () {
      var result = { available: [], alwaysVisible: [] }
      var forEachLayer = function (layer) {
        if (layer.get('available')) {
          result.available.push(layer.get('id'))
        }
        if (layer.get('alwaysVisible')) {
          result.alwaysVisible.push(layer.get('id'))
        }
      }
      map.get('baseLayers').recursiveForEach(forEachLayer)
      map.get('featureLayers').recursiveForEach(forEachLayer)
      return result
    }

    driver.get(config.testClient + '?avalay=' + config.testLayerIds.join(',')).then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      return driver.executeScript(getLayerAvailabilities)
    }).then(result => {
      // console.log(JSON.stringify(result, null, 2))
      config.testLayerIds.forEach(function (id) {
        assert(result.available).contains(id)
      })
      result.available.forEach(function (id) {
        if (result.alwaysVisible.indexOf(id) < 0) {
          assert(config.testLayerIds).contains(id)
        }
      })
      done()
    })
  })

  it('[avalay] if no baselayer is specified in avalay, a default baselayer should be shown.', function (done) {
    function countAvailableBaseLayers () {
      var result = 0
      map.get('baseLayers').recursiveForEach(function (layer) {
        if (layer.get('available')) {
          result++
        }
      })
      return result
    }

    driver.get(config.testClient + '?avalay=' + config.testLayerIds[2]).then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      return driver.executeScript(countAvailableBaseLayers)
    }).then(result => {
      assert(result).equalTo(1)
      done()
    })
  })

  it('[vislay] should have only the (base- & feature-)layers visible that were setted with the "vislay" parameter',
    function (done) {
      function getLayerVisibilities () {
        var vislay = []
        var forEachLayer = function (layer) {
          if (!layer.recursiveForEach && layer.getVisible() && !layer.get('alwaysVisible')) {
            vislay.push(layer.get('id'))
          }
        }
        map.get('baseLayers').recursiveForEach(forEachLayer)
        map.get('featureLayers').recursiveForEach(forEachLayer)
        return vislay
      }

      driver.get(config.testClient + '?vislay=' + config.testLayerIds.join(',')).then(() => {
        return waitUntilMapReady(driver)
      }).then(() => {
        return driver.executeScript(getLayerVisibilities)
      }).then(vislay => {
        config.testLayerIds.forEach(id => assert(vislay).contains(id))
        vislay.forEach(id => assert(config.testLayerIds).contains(id))
        done()
      })
    })

  it('[responsive] should be responsive if the parameter "responsive" was set to true', function (done) {
    driver.get(config.testClient + '?responsive=true').then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      return driver.executeScript(function () {
        return map.get('responsive')
      })
    }).then(responsive => {
      assert(responsive).equalTo(true)
      done()
    })
  })

  it('[responsive] should not be responsive if the parameter "responsive" was set to false', function (done) {
    this.timeout(config.mochaTimeout)
    driver.get(config.testClient + '?responsive=false').then(() => {
      return waitUntilMapReady(driver)
    }).then(() => {
      return driver.executeScript(function () {
        return map.get('responsive')
      })
    }).then(responsive => {
      assert(responsive).equalTo(false)
      done()
    })
  })

  // it('[conf] should use the with "conf" specified config file', function (done) {
  //   this.timeout(config.mochaTimeout)
  //   driver.get(config.testClient + '?conf=' + config.testMiniMapConfigFile).then(function () {
  //     waitUntilMapReady(driver).then(function () {
  //       driver.executeScript('return map.get("configFileName");').then(function (configFileName) {
  //         assert(configFileName).equalTo(config.testMiniMapConfigFile)
  //         //assert(driver.isElementPresent(By.className('g4u-layerselector'))).equalTo(false)
  //         assert(driver.findElements(By.className('g4u-layerselector')).then(found => !!found.length)).equalTo(false)
  //         done()
  //       })
  //     })
  //   })
  // })
  //
  // it('[layconf] should use the alternative layer conf specified with the "layconf" parameter', function (done) {
  //   this.timeout(config.mochaTimeout)
  //   driver.get(config.testClient + '?layconf=' + config.testLayerConfigFile).then(function () {
  //     waitUntilMapReady(driver).then(function () {
  //       driver.executeScript('return map.get("layerConfigFileName");').then(function (layerConfigFileName) {
  //         assert(layerConfigFileName).equalTo(config.testLayerConfigFile)
  //         done()
  //       })
  //     })
  //   })
  // })

  it('[lang] should set the language of the map to the language provided with the "lang" parameter',
    function (done) {
      driver.get(config.testClient + '?lang=en').then(() => {
        return waitUntilMapReady(driver)
      }).then(() => {
        return driver.executeScript(function () {
          return map.get('localiser').getCurrentLang()
        })
      }).then(lang => {
        assert(lang).equalTo('en')
      }).then(() => {
        return driver.get(config.testClient + '?lang=de')
      }).then(() => {
        return waitUntilMapReady(driver)
      }).then(() => {
        return driver.executeScript(function () {
          return map.get('localiser').getCurrentLang()
        })
      }).then(lang => {
        assert(lang).equalTo('de')
      }).then(done)
    })
})
