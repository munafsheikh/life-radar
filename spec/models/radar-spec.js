const Radar = require('../../src/models/radar')
const Sector = require('../../src/models/sector')
const Ring = require('../../src/models/ring')
const Blip = require('../../src/models/blip')
const MalformedDataError = require('../../src/exceptions/malformedDataError')
const ExceptionMessages = require('../../src/util/exceptionMessages')

describe('Radar', function () {
  it('has no sectors by default', function () {
    var radar = new Radar()

    expect(radar.sectors()[0].sector).not.toBeDefined()
    expect(radar.sectors()[1].sector).not.toBeDefined()
    expect(radar.sectors()[2].sector).not.toBeDefined()
    expect(radar.sectors()[3].sector).not.toBeDefined()
  })

  it('sets the first sector', function () {
    var sector, radar, blip

    blip = new Blip('A', new Ring('First'))
    sector = new Sector('First')
    sector.add([blip])
    radar = new Radar()

    radar.addSector(sector)

    expect(radar.sectors()[0].sector).toEqual(sector)
    expect(radar.sectors()[0].sector.blips()[0].number()).toEqual(1)
  })

  it('sets the second sector', function () {
    var sector, radar, blip

    blip = new Blip('A', new Ring('First'))
    sector = new Sector('Second')
    sector.add([blip])
    radar = new Radar()

    radar.addSector(sector)

    expect(radar.sectors()[0].sector).toEqual(sector)
    expect(radar.sectors()[0].sector.blips()[0].number()).toEqual(1)
  })

  it('sets the third sector', function () {
    var sector, radar, blip

    blip = new Blip('A', new Ring('First'))
    sector = new Sector('Third')
    sector.add([blip])
    radar = new Radar()

    radar.addSector(sector)

    expect(radar.sectors()[0].sector).toEqual(sector)
    expect(radar.sectors()[0].sector.blips()[0].number()).toEqual(1)
  })

  it('sets the fourth sector', function () {
    var sector, radar, blip

    blip = new Blip('A', new Ring('First'))
    sector = new Sector('Fourth')
    sector.add([blip])
    radar = new Radar()

    radar.addSector(sector)

    expect(radar.sectors()[0].sector).toEqual(sector)
    expect(radar.sectors()[0].sector.blips()[0].number()).toEqual(1)
  })

  it('throws an error if too many sectors are added', function () {
    var sector, radar, blip

    blip = new Blip('A', new Ring('First'))
    sector = new Sector('First')
    sector.add([blip])
    radar = new Radar()

    radar.addSector(sector)
    radar.addSector(new Sector('Second'))
    radar.addSector(new Sector('Third'))
    radar.addSector(new Sector('Fourth'))

    expect(function () {
      radar.addSector(new Sector('Fifth'))
    }).toThrow(new MalformedDataError(ExceptionMessages.TOO_MANY_QUADRANTS))
  })

  it('throws an error if less than 4 sectors are added', function () {
    var sector, radar, blip

    blip = new Blip('A', new Ring('First'))
    sector = new Sector('First')
    sector.add([blip])
    radar = new Radar()

    radar.addSector(sector)
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

    it('sets blip numbers starting on the first sector', function () {
      radar.addSector(firstSector)

      expect(radar.sectors()[0].sector.blips()[0].number()).toEqual(1)
      expect(radar.sectors()[0].sector.blips()[1].number()).toEqual(2)
    })

    it('continues the number from the previous sector set', function () {
      radar.addSector(firstSector)
      radar.addSector(secondSector)

      expect(radar.sectors()[1].sector.blips()[0].number()).toEqual(3)
      expect(radar.sectors()[1].sector.blips()[1].number()).toEqual(4)
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
    var sector, radar, firstRing, secondRing, otherSector

    beforeEach(function () {
      firstRing = new Ring('Adopt', 0)
      secondRing = new Ring('Hold', 1)
      sector = new Sector('Fourth')
      otherSector = new Sector('Other')
      radar = new Radar()
    })

    it('returns an array for a given set of blips', function () {
      sector.add([new Blip('A', firstRing), new Blip('B', secondRing)])

      radar.addSector(sector)
      radar.addSector(otherSector)
      radar.addSector(otherSector)
      radar.addSector(otherSector)

      expect(radar.rings()).toEqual([firstRing, secondRing])
    })

    it('has unique rings', function () {
      sector.add([new Blip('A', firstRing), new Blip('B', firstRing), new Blip('C', secondRing)])

      radar.addSector(sector)
      radar.addSector(otherSector)
      radar.addSector(otherSector)
      radar.addSector(otherSector)

      expect(radar.rings()).toEqual([firstRing, secondRing])
    })

    it('has sorts by the ring order', function () {
      sector.add([new Blip('C', secondRing), new Blip('A', firstRing), new Blip('B', firstRing)])

      radar.addSector(sector)
      radar.addSector(otherSector)
      radar.addSector(otherSector)
      radar.addSector(otherSector)

      expect(radar.rings()).toEqual([firstRing, secondRing])
    })
  })
})
