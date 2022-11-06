const MalformedDataError = require('../exceptions/malformedDataError')
const ExceptionMessages = require('../util/exceptionMessages')

const _ = {
  map: require('lodash/map'),
  uniqBy: require('lodash/uniqBy'),
  sortBy: require('lodash/sortBy'),
}

const Radar = function () {
  var self, sectors, blipNumber, addingSector, alternatives, currentSheetName

  blipNumber = 0
  addingSector = 0
  sectors = [
    { order: 'first', startAngle: 90 },
    { order: 'second', startAngle: 0 },
    { order: 'third', startAngle: -90 },
    { order: 'fourth', startAngle: -180 },
  ]
  alternatives = []
  currentSheetName = ''
  self = {}

  function setNumbers(blips) {
    blips.forEach(function (blip) {
      blip.setNumber(++blipNumber)
    })
  }

  self.addAlternative = function (sheetName) {
    alternatives.push(sheetName)
  }

  self.getAlternatives = function () {
    return alternatives
  }

  self.setCurrentSheet = function (sheetName) {
    currentSheetName = sheetName
  }

  self.getCurrentSheet = function () {
    return currentSheetName
  }

  self.addSector = function (sector) {
    if (addingSector >= 4) {
      throw new MalformedDataError(ExceptionMessages.TOO_MANY_QUADRANTS)
    }
    sectors[addingSector].sector = sector
    setNumbers(sector.blips())
    addingSector++
  }

  function allSectors() {
    if (addingSector < 4) {
      throw new MalformedDataError(ExceptionMessages.LESS_THAN_FOUR_QUADRANTS)
    }

    return _.map(sectors, 'sector')
  }

  function allBlips() {
    return allSectors().reduce(function (blips, sector) {
      return blips.concat(sector.blips())
    }, [])
  }

  self.rings = function () {
    return _.sortBy(
      _.map(
        _.uniqBy(allBlips(), function (blip) {
          return blip.ring().name()
        }),
        function (blip) {
          return blip.ring()
        },
      ),
      function (ring) {
        return ring.order()
      },
    )
  }

  self.sectors = function () {
    return sectors
  }

  return self
}

module.exports = Radar
