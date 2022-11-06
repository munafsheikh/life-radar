const Radar = require('../../src/models/radar')
const Sector = require('../../src/models/quadrant')
const Ring = require('../../src/models/ring')
const Blip = require('../../src/models/blip')
const MalformedDataError = require('../../src/exceptions/malformedDataError')
const ExceptionMessages = require('../../src/util/exceptionMessages')

describe('Radar', function () {
  it('has no sectors by default', function () {
    var radar = new Radar()

    expect(radar.sectors()[0].quadrant).not.toBeDefined()
    expect(radar.sectors()[1].quadrant).not.toBeDefined()
    expect(radar.sectors()[2].quadrant).not.toBeDefined()
    expect(radar.sectors()[3].quadrant).not.toBeDefined()
  })

  it('sets the first quadrant', function () {
    var quadrant, radar, blip

    blip = new Blip('A', new Ring('First'))
    quadrant = new Sector('First')
    quadrant.add([blip])
    radar = new Radar()

    radar.addSector(quadrant)

    expect(radar.sectors()[0].quadrant).toEqual(quadrant)
    expect(radar.sectors()[0].quadrant.blips()[0].number()).toEqual(1)
  })

  it('sets the second quadrant', function () {
    var quadrant, radar, blip

    blip = new Blip('A', new Ring('First'))
    quadrant = new Sector('Second')
    quadrant.add([blip])
    radar = new Radar()

    radar.addSector(quadrant)

    expect(radar.sectors()[0].quadrant).toEqual(quadrant)
    expect(radar.sectors()[0].quadrant.blips()[0].number()).toEqual(1)
  })

  it('sets the third quadrant', function () {
    var quadrant, radar, blip

    blip = new Blip('A', new Ring('First'))
    quadrant = new Sector('Third')
    quadrant.add([blip])
    radar = new Radar()

    radar.addSector(quadrant)

    expect(radar.sectors()[0].quadrant).toEqual(quadrant)
    expect(radar.sectors()[0].quadrant.blips()[0].number()).toEqual(1)
  })

  it('sets the fourth quadrant', function () {
    var quadrant, radar, blip

    blip = new Blip('A', new Ring('First'))
    quadrant = new Sector('Fourth')
    quadrant.add([blip])
    radar = new Radar()

    radar.addSector(quadrant)

    expect(radar.sectors()[0].quadrant).toEqual(quadrant)
    expect(radar.sectors()[0].quadrant.blips()[0].number()).toEqual(1)
  })

  it('throws an error if too many sectors are added', function () {
    var quadrant, radar, blip

    blip = new Blip('A', new Ring('First'))
    quadrant = new Sector('First')
    quadrant.add([blip])
    radar = new Radar()

    radar.addSector(quadrant)
    radar.addSector(new Sector('Second'))
    radar.addSector(new Sector('Third'))
    radar.addSector(new Sector('Fourth'))

    expect(function () {
      radar.addSector(new Sector('Fifth'))
    }).toThrow(new MalformedDataError(ExceptionMessages.TOO_MANY_QUADRANTS))
  })

  it('throws an error if less than 4 sectors are added', function () {
    var quadrant, radar, blip

    blip = new Blip('A', new Ring('First'))
    quadrant = new Sector('First')
    quadrant.add([blip])
    radar = new Radar()

    radar.addSector(quadrant)
    radar.addSector(new Sector('Second'))
    radar.addSector(new Sector('Third'))

    expect(function () {
      radar.rings()
    }).toThrow(new MalformedDataError(ExceptionMessages.LESS_THAN_FOUR_QUADRANTS))
  })

  describe('blip numbers', function () {
    var firstSector, secondSector, radar, firstRing

    beforeEach(function () {
      firstRing = new Ring('Adopt', 0)
      firstSector = new Sector('First')
      secondSector = new Sector('Second')
      firstSector.add([new Blip('A', firstRing), new Blip('B', firstRing)])
      secondSector.add([new Blip('C', firstRing), new Blip('D', firstRing)])
      radar = new Radar()
    })

    it('sets blip numbers starting on the first quadrant', function () {
      radar.addSector(firstSector)

      expect(radar.sectors()[0].quadrant.blips()[0].number()).toEqual(1)
      expect(radar.sectors()[0].quadrant.blips()[1].number()).toEqual(2)
    })

    it('continues the number from the previous quadrant set', function () {
      radar.addSector(firstSector)
      radar.addSector(secondSector)

      expect(radar.sectors()[1].quadrant.blips()[0].number()).toEqual(3)
      expect(radar.sectors()[1].quadrant.blips()[1].number()).toEqual(4)
    })
  })

  describe('alternatives', function () {
    it('returns a provided alternatives', function () {
      var radar = new Radar()

      var alternative1 = 'alternative1'
      var alternative2 = 'alternative2'

      radar.addAlternative(alternative1)
      radar.addAlternative(alternative2)

      expect(radar.getAlternatives()).toEqual([alternative1, alternative2])
    })
  })

  describe('rings', function () {
    var quadrant, radar, firstRing, secondRing, otherSector

    beforeEach(function () {
      firstRing = new Ring('Adopt', 0)
      secondRing = new Ring('Hold', 1)
      quadrant = new Sector('Fourth')
      otherSector = new Sector('Other')
      radar = new Radar()
    })

    it('returns an array for a given set of blips', function () {
      quadrant.add([new Blip('A', firstRing), new Blip('B', secondRing)])

      radar.addSector(quadrant)
      radar.addSector(otherSector)
      radar.addSector(otherSector)
      radar.addSector(otherSector)

      expect(radar.rings()).toEqual([firstRing, secondRing])
    })

    it('has unique rings', function () {
      quadrant.add([new Blip('A', firstRing), new Blip('B', firstRing), new Blip('C', secondRing)])

      radar.addSector(quadrant)
      radar.addSector(otherSector)
      radar.addSector(otherSector)
      radar.addSector(otherSector)

      expect(radar.rings()).toEqual([firstRing, secondRing])
    })

    it('has sorts by the ring order', function () {
      quadrant.add([new Blip('C', secondRing), new Blip('A', firstRing), new Blip('B', firstRing)])

      radar.addSector(quadrant)
      radar.addSector(otherSector)
      radar.addSector(otherSector)
      radar.addSector(otherSector)

      expect(radar.rings()).toEqual([firstRing, secondRing])
    })
  })
})
