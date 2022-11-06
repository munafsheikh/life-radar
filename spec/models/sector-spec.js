const Sector = require('../../src/models/sector')
const Blip = require('../../src/models/blip')

describe('Sector', function () {
  it('has a name', function () {
    var quadrant = new Sector('My Sector')

    expect(quadrant.name()).toEqual('My Sector')
  })

  it('has no blips by default', function () {
    var quadrant = new Sector('My Sector')

    expect(quadrant.blips()).toEqual([])
  })

  it('can add a single blip', function () {
    var quadrant = new Sector('My Sector')

    quadrant.add(new Blip())

    expect(quadrant.blips().length).toEqual(1)
  })

  it('can add multiple blips', function () {
    var quadrant = new Sector('My Sector')

    quadrant.add([new Blip(), new Blip()])

    expect(quadrant.blips().length).toEqual(2)
  })
})
