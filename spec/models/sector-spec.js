const Sector = require('../../src/models/sector')
const Blip = require('../../src/models/blip')

describe('Sector', function () {
  it('has a name', function () {
    var sector = new Sector('My Sector')

    expect(sector.name()).toEqual('My Sector')
  })

  it('has no blips by default', function () {
    var sector = new Sector('My Sector')

    expect(sector.blips()).toEqual([])
  })

  it('can add a single blip', function () {
    var sector = new Sector('My Sector')

    sector.add(new Blip())

    expect(sector.blips().length).toEqual(1)
  })

  it('can add multiple blips', function () {
    var sector = new Sector('My Sector')

    sector.add([new Blip(), new Blip()])

    expect(sector.blips().length).toEqual(2)
  })
})
